import { getManager, getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { getUtcNow } from './getUtcNow';
import * as moment from 'moment';
import { Subscription } from '../entity/Subscription';
import { SubscriptionType } from '../types/SubscriptionType';
import { SubscriptionStatus } from '../types/SubscriptionStatus';
import { getSubscriptionPrice } from './getSubscriptionPrice';
import { UserBalanceTransaction } from '../entity/UserBalanceTransaction';
import { calculateNewSubscriptionPaymentDetail } from './calculateNewSubscriptionPaymentDetail';
import { PaymentStatus } from '../types/PaymentStatus';
import { Payment } from '../entity/Payment';

export async function provisionSubscriptionPurchase(
  userId: string,
  type: SubscriptionType,
  recurring: boolean,
  symbols: string[],
  preferToUseBalance: boolean,
  alertDays: number,
  ipAddress: string
): Promise<Payment> {
  const now = getUtcNow();

  const months = type === SubscriptionType.UnlimitedQuarterly ? 3 : 1;
  const end = moment(now).add(months, 'month').toDate();
  let payment: Payment = null;

  await getManager().transaction(async (m) => {
    const subscriptionId = uuidv4();
    const subscription = new Subscription();
    subscription.id = subscriptionId;
    subscription.userId = userId;
    subscription.type = type;
    subscription.symbols = type === SubscriptionType.SelectedMonthly ? symbols : [];
    subscription.recurring = recurring;
    subscription.start = now;
    subscription.end = end;
    subscription.preferToUseBalance = preferToUseBalance;
    subscription.alertDays = alertDays;
    subscription.status = SubscriptionStatus.Provisioning;

    await m.save(subscription);

    const detail = await calculateNewSubscriptionPaymentDetail(m, userId, type, preferToUseBalance, symbols);
    const { balanceDeductAmount, additionalPay, paymentMethod } = detail;
    let balanceTransaction: UserBalanceTransaction = null;
    if (balanceDeductAmount > 0) {
      balanceTransaction = new UserBalanceTransaction();
      balanceTransaction.userId = userId;
      balanceTransaction.amount = -1 * balanceDeductAmount;
      await m.save(balanceTransaction);
    }

    const paymentId = uuidv4();
    payment = new Payment();
    payment.id = paymentId;
    payment.userId = userId;
    payment.amount = additionalPay;
    payment.method = paymentMethod;
    payment.status = PaymentStatus.Pending;
    payment.ipAddress = ipAddress;
    payment.auto = false;
    payment.balanceTransaction = balanceTransaction;
    payment.subscription = subscription;

    await m.save(payment);
  });

  return payment;
}



