import * as iex from 'iexcloud_api_wrapper';
import { Connection, getManager, getRepository, LessThan, Not } from 'typeorm';
import errorToJson from 'error-to-json';
import { connectDatabase } from '../src/db';
import { getReferralGlobalPolicy } from '../src/api/referralPolicyController';
import { Subscription } from '../src/entity/Subscription';
import { SubscriptionStatus } from '../src/types/SubscriptionStatus';
import { getUtcNow } from '../src/utils/getUtcNow';
import { UserBalanceTransaction } from '../src/entity/UserBalanceTransaction';
import { getUnitPricing } from '../src/utils/getUnitPricing';
import { SubscriptionType } from '../src/types/SubscriptionType';
import { getSubscriptionPrice } from '../src/utils/getSubscriptionPrice';
import { Payment } from '../src/entity/Payment';
import { PaymentStatus } from '../src/types/PaymentStatus';
import * as moment from 'moment';
import { getUserBalance } from '../src/utils/getUserBalance';
import { previewSubscriptionPayment } from '../src/api';
import { calculateNewSubscriptionPaymentDetail } from '../src/utils/calculateNewSubscriptionPaymentDetail';

async function expireSubscriptions() {
  await getManager()
    .createQueryBuilder()
    .update(Subscription)
    .set({ status: SubscriptionStatus.Expired })
    .where(`status = :status`, { status: SubscriptionStatus.Alive })
    .andWhere(`"end" < now()`)
    .execute();
}

async function sendAlertForExpiringSubscriptions() {
  const list = await getRepository(Subscription)
    .createQueryBuilder()
    .where(`status = :status`, { status: SubscriptionStatus.Alive })
    .andWhere(`DATEADD(day, "alertDays", now()) >= "end"`)
    .execute();
  // TODO: send notificaiton emails to them
}

async function handlePayWithCard(subscription: Subscription) {
  // TODO: Call API to pay by card
  const rawRequest = {};
  const rawResponse = {};
  const status = PaymentStatus.Paid;
  return { rawRequest, rawResponse, status };
}

function extendSubscriptionEndDate(subscription: Subscription) {
  const { end, type } = subscription;
  let newEnd = end;
  switch (type) {
    case SubscriptionType.UnlimitedMontly:
      newEnd = moment(end).add(1, 'month').toDate();
      break;
    case SubscriptionType.UnlimitedYearly:
      newEnd = moment(end).add(12, 'month').toDate();
    default:
      throw new Error(`Unkonwn subscription type ${type}`);
  }

  subscription.end = newEnd;
}

async function renewRecurringSubscription(subscription: Subscription) {
  const { userId } = subscription;


  const { rawRequest, rawResponse, status } = await handlePayWithCard(subscription);
  await getManager().transaction(async m => {
    const { balanceDeductAmount, additionalPay } = await calculateNewSubscriptionPaymentDetail(
      m,
      userId,
      subscription.type,
      true
    );


    let balanceTransaction: UserBalanceTransaction = null;
    if (balanceDeductAmount) {
      balanceTransaction = new UserBalanceTransaction();
      balanceTransaction.userId = userId;
      balanceTransaction.amount = -1 * balanceDeductAmount;
      await m.save(balanceTransaction);
    }
    const payment = new Payment();
    payment.subscription = subscription;
    payment.balanceTransaction = balanceTransaction;
    payment.amount = additionalPay;
    // payment.method = paymentMethod;
    payment.rawResponse = rawResponse;
    payment.status = status;
    payment.auto = true;
    payment.subscription = subscription;
    await m.save(payment);

    extendSubscriptionEndDate(subscription);
    await m.save(subscription);
  })
}

async function handleRecurringPayments() {
  const list: Subscription[] = await getRepository(Subscription)
    .createQueryBuilder()
    .where(`status = :status`, { status: SubscriptionStatus.Alive })
    .andWhere(`recurring = TRUE`)
    .andWhere(`DATEADD(day, "alertDays", now()) >= "end"`)
    .leftJoinAndSelect('payments', 'payment')
    .execute();

  for (const subscription of list) {
    await renewRecurringSubscription(subscription);
  }
}

async function scanSubscriptions() {
  await handleRecurringPayments();
  await sendAlertForExpiringSubscriptions();
  await expireSubscriptions();
}

export const start = async () => {
  let connection: Connection = null;
  try {
    connection = await connectDatabase();
    await scanSubscriptions();
    console.log('Task', 'subscription', 'done');
  } catch (e) {
    console.error('Task', 'subscription', 'failed', errorToJson(e));
  } finally {
    connection?.close();
  }
};
