import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Space, Button, Typography, Modal, Row, Col } from 'antd';
import ReactDOM from 'react-dom';
import { getMyAccount } from 'services/accountService';
import ReferralLinkInput from 'components/ReferralLinkInput';
import { FormattedMessage } from 'react-intl';
import { from } from 'rxjs';
import { useIntl } from 'react-intl';
import EarnCommissionGuideZh from './EarnCommissionGuideZh';
import EarnCommissionGuideEn from './EarnCommissionGuideEn';

const { Paragraph } = Typography;

const EarnCommissionModal = props => {

  const { onOk } = props;

  const [account, setAccount] = React.useState({});
  const intl = useIntl();

  const isEn = intl.locale === 'en';
  const isZh = intl.locale === 'zh'

  const load = async () => {
    try {
      const account = await getMyAccount();

      ReactDOM.unstable_batchedUpdates(() => {
        setAccount(account);
      })
    } catch (e) {
    }
  }

  React.useEffect(() => {
    const load$ = from(load(false)).subscribe();
    return () => {
      load$.unsubscribe();
    }
  }, []);

  return (
    <Modal
      title={<FormattedMessage id="menu.earnCommission" />}
      width={680}
      closable={true}
      maskClosable={true}
      destroyOnClose={true}
      footer={null}
      {...props}>
      <Paragraph type="secondary"><FormattedMessage id="text.shareReferralLink" /></Paragraph>
      <ReferralLinkInput value={account?.referralUrl} />
      <Row gutter={[10, 10]} wrap={true} justify="end" style={{marginTop: 10, marginBottom: 30}}>
        <Col >
          <Link to="/account"><Button type="primary" ghost onClick={onOk}>Subscription Deduction</Button></Link>
        </Col>
        <Col>
          <Link to="/account"><Button type="primary" onClick={onOk}>Go to Commission Withdrawal</Button></Link>
        </Col>
      </Row>
      {isZh ? <EarnCommissionGuideZh /> : <EarnCommissionGuideEn />}
    </Modal>
  )
}

EarnCommissionModal.propTypes = {};

EarnCommissionModal.defaultProps = {};

export default withRouter(EarnCommissionModal);
