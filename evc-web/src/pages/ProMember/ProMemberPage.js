import { Alert, Button, Card, Space, Modal, Image, Row, Col, List, Tooltip, Tag, Descriptions } from 'antd';
import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';
import { StockNoticeButton } from 'components/StockNoticeButton';
import { withRouter } from 'react-router-dom';
import SignUpForm from 'components/SignUpForm';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import putCallData from './putCallData';
import rosterListData from './rosterData';
import { FormattedMessage } from 'react-intl';
import { useMediaQuery } from 'react-responsive'
import { TimeAgo } from 'components/TimeAgo';

import Joyride from 'react-joyride';
import {
  BarChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import ReactDOM from "react-dom";
import INSIDER_LEGEND_INFOS from '../../def/insiderLegendDef';
import * as moment from 'moment';

const { Paragraph, Text } = Typography;


const Container = styled.div`
margin: 0;
padding: 30px 0;
background-color: #f0f2f5;
position:relative;

img {
  width: 200px;
}

.ant-card-head {
  background-color: #57BB60;

  .ant-card-head-title {
    color: rgba(255,255,255,0.9);
  }
}

.current-element {
  filter: brightness(1);
  width: 100%;
  outline: 4px solid red;
  border-radius: 4px;
}
`;

const RosterList = styled(List)`
.ant-list-item {
  padding-left: 0;
  padding-right: 0;
}
`;

const RosterContainer = styled(Space)`
.ant-descriptions-title {
  font-size: 14px;
  // color: #3273A4 !important;
}

.ant-descriptions-item-label {
  font-size: 0.9rem;
  color: rgba(0,0,0,0.45);
}

.ant-descriptions-header {
  margin: 0;
}

.ant-descriptions-item {
  padding-bottom: 2px !important;
}
`;

const insiderSpan = {
  xs: 1,
  sm: 2,
  md: 2,
  lg: 1,
  xl: 2,
  xxl: 3
};

const WalkthroughTour = withRouter((props) => {

  const { visible: visibleProp, onClose, onComplete } = props;

  const [visible, setVisible] = React.useState(visibleProp);


  React.useEffect(() => {
    setVisible(visibleProp);
  }, [visibleProp])

  const tourConfig = [
    {
      target: '#tour-fair-value',
      disableBeacon: true,
      content: <>
        <Paragraph strong>
          <FormattedMessage id="tour.fairValueTitle" />
        </Paragraph>
        <Paragraph style={{ fontSize: 14 }}>
          <FormattedMessage id="tour.fairValueDescription" />
        </Paragraph>
        <Paragraph type="danger" style={{ fontSize: 14 }}>
          <FormattedMessage id="tour.fairValueNote" />
        </Paragraph>
      </>
    },
    {
      target: '#tour-support',
      disableBeacon: true,
      placement: 'top',
      content: <>
        <Paragraph strong>
          <FormattedMessage id="tour.supportTitle" />
        </Paragraph>
        <Paragraph style={{ fontSize: 12 }}>
          <FormattedMessage id="tour.supportDescription" />
        </Paragraph>
        <Paragraph type="danger" style={{ fontSize: 12 }}>
          <FormattedMessage id="tour.supportNote" />
        </Paragraph>
      </>
    },
    {
      target: '#tour-resistance',
      disableBeacon: true,
      content: <>
        <Paragraph strong>
          <FormattedMessage id="tour.resistanceTitle" />
        </Paragraph>
        <Paragraph style={{ fontSize: 12 }}>
          <FormattedMessage id="tour.resistanceDescription" />
        </Paragraph>
        <Paragraph type="danger" style={{ fontSize: 12 }}>
          <FormattedMessage id="tour.resistanceNote" />
        </Paragraph>
      </>
    },
    {
      target: '#tour-putcall',
      placement: 'auto',
      disableBeacon: true,
      content: <>
        <Paragraph strong>
          <FormattedMessage id="tour.putCallTitle" />
        </Paragraph>
        <Paragraph style={{ fontSize: 12 }}>
          <FormattedMessage id="tour.putCallDescription" />
        </Paragraph>
        <Paragraph type="danger" style={{ fontSize: 12 }}>
          <FormattedMessage id="tour.putCallNote" />
        </Paragraph>
      </>
    },
    // {
    //   target: '#tour-putcall-button',
    //   placement: 'auto',
    //   disableBeacon: true,
    //   content: <>
    //     <Paragraph strong>
    //       <FormattedMessage id="tour.putCallTitle" />
    //     </Paragraph>
    //     <Paragraph style={{ fontSize: 12 }}>
    //       <FormattedMessage id="tour.putCallDescription" />
    //     </Paragraph>
    //     <Paragraph type="danger" style={{ fontSize: 12 }}>
    //       <FormattedMessage id="tour.putCallNote" />
    //     </Paragraph>
    //   </>
    // },
    {
      target: '#tour-insider',
      placement: 'auto',
      disableBeacon: true,
      content: <>
        <Paragraph strong>
          <FormattedMessage id="tour.insiderTitle" />
        </Paragraph>
        <Paragraph style={{ fontSize: 12 }}>
          <FormattedMessage id="tour.insiderDescription" />
        </Paragraph>
      </>
    },
    {
      target: '#tour-alert',
      placement: 'auto',
      disableBeacon: true,
      content: <>
        <Paragraph strong>
          <FormattedMessage id="tour.alertTitle" />
        </Paragraph>
        <Paragraph style={{ fontSize: 12 }}>
          <FormattedMessage id="tour.alertDescription" />
        </Paragraph>
      </>
    },
  ];

  const handleTourStepChange = data => {
    const { action, index } = data;
    switch (action) {
      case 'reset': {
        onComplete();
        onClose();
        break;
      }
      case 'skip':
      case 'stop':
      case 'close': {
        onClose();
        break;
      }
      default:
        break;
    }
  }

  return <Joyride
    steps={tourConfig}
    run={visible}
    continuous={true}
    // scrollToFirstStep={true}
    // showProgress={true}
    // scrollToFirstStep={true}
    // stepIndex={current}
    showSkipButton={true}
    callback={handleTourStepChange}
    styles={{
      options: {
        // arrowColor: '#e3ffeb',
        // backgroundColor: '#e3ffeb',
        // overlayColor: 'rgba(79, 26, 0, 0.4)',
        primaryColor: '#57BB60',
        textAlign: 'left',
        // textColor: '#004a14',
        width: 600,
        zIndex: 1000,
      },
      tooltipContainer: {
        textAlign: 'left'
      },
      tooltip: {
        fontSize: 14
      }
    }}
  />
});

const PutCallDummyChart = () => {
  const data = putCallData.map(x => ({
    ...x,
    value: +(x.value.toFixed(2))
  }));

  const config = {
    data: data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    xAxis: { type: 'time' },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return v?.toLocaleString();
        },
      },
    },
    color: ['#531dab', '#ffc53d'],
  };

  return <Line {...config} />
}

const ProMemberPage = (props) => {
  const [visible, setVisible] = React.useState(true);
  const [signUpVisible, setSignUpVisible] = React.useState(false);
  const [stockChartVisible, setStockChartVisible] = React.useState(false);
  const [putCallChartVisible, setPutCallChartVisible] = React.useState(false);

  const showInlineStockChart = useMediaQuery({ query: '(min-width: 576px)' });
  const showImage = showInlineStockChart;
  const showBigImage = useMediaQuery({ query: '(min-width: 876px)' });
  const superNarrow = useMediaQuery({ query: '(max-width: 465px)' });

  const NewsImage = styled(Image)`
  display: ${showImage ? 'inline-block' : 'none'};
  width: ${showBigImage ? 200 : 100}px !important;
  cursor: pointer;
  `;

  const handleShowStockChart = () => {
    ReactDOM.unstable_batchedUpdates(() => {
      setStockChartVisible(true);
      setPutCallChartVisible(false);
    });
  }

  const handleShowPutCallRatioChart = () => {
    ReactDOM.unstable_batchedUpdates(() => {
      setStockChartVisible(false);
      setPutCallChartVisible(true);
    });
  }

  const getBadgeComponent = (transactionType) => {
    const info = INSIDER_LEGEND_INFOS[transactionType];
    if (!info) return null;
    return <Tooltip title={info?.message ?? transactionType}>
      <Tag color={info?.color ?? '#888888'}>{transactionType}</Tag>
    </Tooltip>
  }

  const formatDate = (dateString) => {
    return dateString ? moment(dateString, 'YYYY-MM-DD').format('DD MMM YYYY') : null;
  }

  return (
    <Container>
      <WalkthroughTour visible={visible} onClose={() => setVisible(false)} onComplete={() => setSignUpVisible(true)} />
      <Modal
        visible={stockChartVisible}
        title="EVCT"
        onOk={() => setStockChartVisible(false)}
        onCancel={() => setStockChartVisible(false)}
        closable={true}
        destroyOnClose={true}
        maskClosable={true}
        footer={null}
        width="100vw"
        centered
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ height: '649px', minWidth: '400px' }}>
          <article id="tradingview-widget-0.4101095987438359" style={{ width: '100%', height: '100%' }}>
            <div id="tradingview_ad891-wrapper" style={{ position: 'relative', boxSizing: 'content-box', width: '100%', height: '100%', margin: '0 auto !important', padding: '0 !important', fontFamily: 'Arial,sans-serif' }}>
              <div style={{ width: '100%', height: '100%', background: 'transparent', padding: '0 !important' }}>
                <iframe id="tradingview_ad891" src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_f5b45&symbol=AAPL&interval=D&hidelegend=1&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=F1F3F6&studies=%5B%5D&hideideas=1&theme=Light&style=1&timezone=America%2FNew_York&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=AAPL" style={{ width: '100%', height: '100%', margin: '0 !important', padding: '0 !important' }} allowTransparency="true" scrolling="no" allowFullScreen frameBorder={0} />
              </div>
            </div>
          </article>
        </div>
      </Modal>
      <Modal
        visible={putCallChartVisible}
        title="EVCT"
        onOk={() => setPutCallChartVisible(false)}
        onCancel={() => setPutCallChartVisible(false)}
        closable={true}
        maskClosable={true}
        destroyOnClose={true}
        footer={null}
        width="100vw"
        centered
      >
        <PutCallDummyChart />
      </Modal>
      <Modal
        style={{ maxWidth: 'calc(100vw - 20px)', width: 300 }}
        width={340}
        visible={signUpVisible}
        maskClosable={true}
        destroyOnClose={true}
        onOk={() => setSignUpVisible(false)}
        onCancel={() => setSignUpVisible(false)}
        footer={null}
      >
        <SignUpForm onOk={() => props.history.push('/')} />
      </Modal>
      <main className="ant-layout-content ant-pro-basicLayout-content ant-pro-basicLayout-has-header">
        {/* <Space style={{ marginBottom: 30, width: '100%', justifyContent: 'flex-end' }}>
          <Link to="/"><Button type="link">Home</Button></Link>
          <Button type="link" onClick={() => setVisible(true)}>Restart Tour</Button>
          <Link to="/signup"><Button type="primary" onClick={() => setVisible(true)}>Sign Up</Button></Link>
        </Space> */}
        <Alert
          type="success"
          icon={<InfoCircleOutlined />}
          showIcon
          description={<FormattedMessage id="text.startTourAlert" />}
          style={{ marginBottom: 30 }}
          action={
            <Button type="primary" onClick={() => setVisible(true)}>
              <FormattedMessage id="text.startTour" />
            </Button>
          }
        />
        <div className="sc-khQdMy cdJLiE">
          <div className="ant-page-header" style={{ backgroundColor: 'white', padding: '30px 30px 14px' }}>
            <div className="ant-page-header-heading">
              <div className="ant-page-header-heading-left">
                <span className="ant-page-header-heading-title">
                  <div className="ant-space ant-space-horizontal ant-space-align-center">
                    <div className="ant-space-item">
                      <div className="ant-space ant-space-horizontal ant-space-align-center">
                        <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography"><strong>EVCT</strong></span></div>
                        <div className="ant-space-item"><span className="ant-typography ant-typography-secondary" style={{ fontWeight: 300 }}>(Easy Value Check Inc)</span></div>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
              <span className="ant-page-header-heading-extra">
                <Space id="tour-alert">
                  <StockNoticeButton value={true} />

                  <span role="img" aria-label="star" style={{ fontSize: '20px', color: 'rgb(250, 219, 20)' }} tabIndex={-1} className="anticon anticon-star">
                    <svg viewBox="64 64 896 896" focusable="false" data-icon="star" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                      <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
                    </svg>
                  </span>
                </Space>
              </span>
            </div>
            <div className="ant-page-header-content"><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: 'rgb(0, 41, 61)' }}>S&amp;P 500</span><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: 'rgb(0, 41, 61)' }}>Dow Jones 30</span><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: 'rgb(0, 41, 61)' }}>Nasdaq 100</span><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: 'rgb(0, 41, 61)' }}>Nasdaq Composite</span><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: 'rgb(0, 41, 61)' }}>S&amp;P 100</span><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: 'rgb(0, 41, 61)' }}>Russell 1000</span><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: 'rgb(0, 41, 61)' }}>Russell 3000</span><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: 'rgb(0, 41, 61)' }}>S&amp;P 500 Information Technology</span></div>
          </div>
          <Row gutter={[30, 30]} style={{ marginTop: 30 }}>
            <Col {...{ xs: 24, sm: 24, md: 24, lg: 24, xl: 10, xxl: 8 }}>
              <Row gutter={[30, 30]}>
                <Col {...{ xs: 24, sm: 24, md: 12, lg: 12, xl: 24, xxl: 24 }}>
                  <div className="ant-card ant-card-bordered ant-card-small">
                    <div className="ant-card-body" style={{ minHeight: '178px' }}>
                      <Space size="small" direction="vertical">
                        <div>
                          <Text style={{ fontSize: 30 }} strong>133.67 <span className="ant-typography ant-typography-success"><small>+0.720 (+0.536%)</small></span></Text>
                          <div><Text type="secondary"><small>Price At: 5:59 am EST</small></Text></div>
                        </div>

                        <div>
                          <Text style={{ fontSize: 20 }} strong>25.98 <span className="ant-typography ant-typography-success"><small>+0.010 (+0.039%)</small></span></Text>
                          <div>
                            <Space size="small" style={{ width: '100%', alignItems: 'flex-start' }}>
                              <Text type="secondary"><small>extended hours</small></Text>
                              <TimeAgo direction={superNarrow ? 'vertical' : 'horizontal'} value={moment().add(-1, 'day').toDate()} />
                            </Space>
                          </div>
                        </div>
                      </Space>
                    </div>
                  </div>
                  <div style={{ marginTop: '30px' }} className="ant-card ant-card-small ant-card-type-inner sc-cTApHj fVRyQa">
                    <div className="ant-card-head" style={{ color: 'rgb(0, 41, 61)' }}>
                      <div className="ant-card-head-wrapper">
                        <div className="ant-card-head-title">
                          <FormattedMessage id="text.nextReportDate" />
                        </div>
                      </div>
                    </div>
                    <div className="ant-card-body" style={{ height: '65px', overflow: 'auto' }}>
                      <div className="ant-space ant-space-horizontal ant-space-align-center">
                        <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography" style={{ fontSize: '20px' }}><strong>1 May 2021</strong></span></div>
                        <div className="ant-space-item">
                          <div className="ant-space ant-space-horizontal ant-space-align-center sc-bqiQRQ hUhAjW">
                            <div className="ant-space-item">
                              <div className="ant-space ant-space-horizontal ant-space-align-center">
                                <div className="ant-space-item"><span className="ant-typography ant-typography-secondary"><time dateTime="2021-04-27T14:00:00.000Z" title="Wednesday, April 28, 2021, 12:00:00 AM">in 2 days</time></span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col {...{ xs: 24, sm: 24, md: 12, lg: 12, xl: 24, xxl: 24 }}>
                  <div className="ant-card ant-card-small ant-card-type-inner sc-cTApHj fVRyQa">
                    <div className="ant-card-head" style={{ color: 'rgb(0, 41, 61)' }}>
                      <div className="ant-card-head-wrapper">
                        <div className="ant-card-head-title">
                          <FormattedMessage id="text.evcCoreInfo" />
                        </div>
                      </div>
                    </div>
                    <div className="ant-card-body" style={{ height: '274px' }} >
                      <div className="ant-space ant-space-vertical" style={{ width: '100%' }} >
                        <div className="ant-space-item" style={{ marginBottom: '8px' }} id="tour-fair-value">
                          <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between' }}>
                            <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography ant-typography-secondary">
                              <FormattedMessage id="text.fairValue" />

                            </span></div>
                            <div className="ant-space-item">
                              <div className="ant-space ant-space-horizontal ant-space-align-center number">
                                <div className="ant-space-item">
                                  <div className="sc-llYToB bepCke"><span className="ant-typography">122.33 </span> ~ <span className="ant-typography">147.22 </span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ant-space-item" style={{ marginBottom: '8px' }} id="tour-support">
                          <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography ant-typography-secondary">
                              <FormattedMessage id="text.support" />
                            </span></div>
                            <div className="ant-space-item">
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div className="ant-space ant-space-horizontal ant-space-align-center number">
                                  <div className="ant-space-item">
                                    <div className="sc-llYToB bepCke"><span className="ant-typography">114.60 </span> ~ <span className="ant-typography">116.00 </span></div>
                                  </div>
                                </div>
                                <div className="ant-space ant-space-horizontal ant-space-align-center number">
                                  <div className="ant-space-item">
                                    <div className="sc-llYToB bepCke"><span className="ant-typography">108.00 </span> ~ <span className="ant-typography">111.00 </span></div>
                                  </div>
                                </div>
                                <div className="ant-space ant-space-horizontal ant-space-align-center number">
                                  <div className="ant-space-item">
                                    <div className="sc-llYToB bepCke"><span className="ant-typography">88.00 </span> ~ <span className="ant-typography">98.00 </span></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ant-space-item" id="tour-resistance">

                          <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography ant-typography-secondary">
                              <FormattedMessage id="text.resistance" />
                            </span></div>
                            <div className="ant-space-item">
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div className="ant-space ant-space-horizontal ant-space-align-center number">
                                  <div className="ant-space-item">
                                    <div className="sc-llYToB bepCke"><span className="ant-typography">122.00 </span> ~ <span className="ant-typography">128.00 </span></div>
                                  </div>
                                </div>
                                <div className="ant-space ant-space-horizontal ant-space-align-center number">
                                  <div className="ant-space-item">
                                    <div className="sc-llYToB bepCke"><span className="ant-typography">122.00 </span> ~ <span className="ant-typography">129.00 </span></div>
                                  </div>
                                </div>
                                <div className="ant-space ant-space-horizontal ant-space-align-center number">
                                  <div className="ant-space-item">
                                    <div className="sc-llYToB bepCke"><span className="ant-typography">133.00 </span> ~ <span className="ant-typography">137.50 </span></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            {showInlineStockChart && <Col {...{ xs: 24, sm: 24, md: 24, lg: 24, xl: 14, xxl: 16 }}>
              <div style={{ height: '649px', minWidth: '400px' }}>
                <article id="tradingview-widget-0.4101095987438359" style={{ width: '100%', height: '100%' }}>
                  <div id="tradingview_ad891-wrapper" style={{ position: 'relative', boxSizing: 'content-box', width: '100%', height: '100%', margin: '0 auto !important', padding: '0 !important', fontFamily: 'Arial,sans-serif' }}>
                    <div style={{ width: '100%', height: '100%', background: 'transparent', padding: '0 !important' }}>
                      <iframe id="tradingview_ad891" src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_f5b45&symbol=AAPL&interval=D&hidelegend=1&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=F1F3F6&studies=%5B%5D&hideideas=1&theme=Light&style=1&timezone=America%2FNew_York&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=AAPL" style={{ width: '100%', height: '100%', margin: '0 !important', padding: '0 !important' }} allowTransparency="true" scrolling="no" allowFullScreen frameBorder={0} />
                    </div>
                  </div>
                </article>
              </div>
            </Col>}
          </Row>
          {showInlineStockChart && <Row gutter={[30, 30]} style={{ marginTop: 30 }}>
            <Col span={24} id="tour-putcall">
              <Card
                size="small"
                type="inner"
                title={<FormattedMessage id="text.optionPutCallRatio" />}
              >
                <PutCallDummyChart />
              </Card>
            </Col>
          </Row>}
          {!showInlineStockChart && <Row gutter={[30, 30]} style={{ marginTop: 30 }}>
            <Col span={superNarrow ? 24 : 12}>
              <Button block type="primary" icon={<BarChartOutlined />} onClick={() => handleShowStockChart()}>
                {' '}<FormattedMessage id="text.stockChart" />
              </Button>
            </Col>
            <Col span={superNarrow ? 24 : 12}>
              <Button block type="primary" id="tour-putcall" icon={<LineChartOutlined />} onClick={() => handleShowPutCallRatioChart()}>
                {' '}<FormattedMessage id="text.optionPutCallRatio" />
              </Button>
            </Col>
          </Row>}
          <Row gutter={[30, 30]} style={{ marginTop: 30 }} id="tour-insider">
            <Col {...{ xs: 24, sm: 24, md: 24, lg: 12, xl: 8, xxl: 6 }}>
              <div className="ant-card ant-card-small ant-card-type-inner sc-cTApHj fVRyQa">
                <div className="ant-card-head" style={{ color: 'rgb(0, 41, 61)' }}>
                  <div className="ant-card-head-wrapper">
                    <div className="ant-card-head-title">
                      <FormattedMessage id="text.roster" />
                    </div>
                  </div>
                </div>
                <div className="ant-card-body" style={{ height: '500px', overflow: 'auto' }}>
                  <div className="ant-spin-nested-loading">
                    <div className="ant-spin-container">
                      <div className="ant-list ant-list-sm ant-list-split ant-list-grid sc-caiKgP ipNIuR">
                        <div className="ant-spin-nested-loading">
                          <div className="ant-spin-container">
                            <div className="ant-row" style={{ marginLeft: '-5px', marginRight: '-5px', rowGap: '0px' }}>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">COOK TIMOTHY D</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">333,987</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">Adams Katherine L.</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">118,128</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">Maestri Luca</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">118,128</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">WILLIAMS JEFFREY E</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">118,128</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">O'BRIEN DEIRDRE</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">49,836</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">KONDO CHRIS</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">15,586</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">BELL JAMES A</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">1,986</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">GORE ALBERT JR</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">1,986</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">JUNG ANDREA</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">1,986</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '100%', maxWidth: '100%' }}>
                                <div style={{ paddingLeft: '5px', paddingRight: '5px', flex: '1 1 auto' }} className="ant-col">
                                  <div className="ant-list-item">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', borderBottom: '1px dotted rgba(0, 0, 0, 0.1)' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography">LEVINSON ARTHUR D</span></div>
                                      <div className="ant-space-item"><span className="ant-typography">1,986</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col {...{ xs: 24, sm: 24, md: 24, lg: 12, xl: 16, xxl: 18 }}>
              <Card
                size="small"
                type="inner"
                title={<FormattedMessage id="text.insiderTransactions" />}
                bodyStyle={{ height: 500, overflow: 'auto' }}>
                <RosterContainer direction="vertical" size="small" style={{ width: '100%' }}>

                  <Space direction="vertical" size="small" style={{ marginBottom: 24 }}>
                    {Object.entries(INSIDER_LEGEND_INFOS).map(([k, v]) => <div key={k}>
                      <Tag color={v.color}>{k}</Tag>
                      {v.message}
                    </div>)}
                  </Space>
                  <RosterList
                    grid={{ column: 1 }}
                    itemLayout="horizontal"
                    size="small"
                    dataSource={rosterListData}
                    renderItem={item => (
                      <List.Item>
                        <Descriptions
                          title={<Space>{item.fullName} {item.reportedTitle && <Text type="secondary" style={{ fontWeight: 400, fontSize: '0.8rem' }}>{item.reportedTitle}</Text>}</Space>}
                          size="small"
                          column={insiderSpan}
                          extra={getBadgeComponent(item.transactionCode)}
                        >
                          <Descriptions.Item label="Exercise price">{item.conversionOrExercisePrice}</Descriptions.Item>
                          <Descriptions.Item label="Filing date">{formatDate(item.filingDate)}</Descriptions.Item>
                          <Descriptions.Item label="Post shares">{item.postShares?.toLocaleString()}</Descriptions.Item>
                          <Descriptions.Item label="Transaction date">{formatDate(item.transactionDate)}</Descriptions.Item>
                          <Descriptions.Item label="Transaction price">{item.transactionPrice?.toLocaleString()}</Descriptions.Item>
                          <Descriptions.Item label="Transaction shares">{item.transactionShares?.toLocaleString()}</Descriptions.Item>
                          <Descriptions.Item label="Transaction value">{item.transactionValue?.toLocaleString()}</Descriptions.Item>
                        </Descriptions>
                      </List.Item>
                    )}
                  />
                </RosterContainer>
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: 30 }}>
            <Col span={24}>
              <div className="ant-card ant-card-small ant-card-type-inner sc-cTApHj fVRyQa">
                <div className="ant-card-head" style={{ color: 'rgb(0, 41, 61)' }}>
                  <div className="ant-card-head-wrapper">
                    <div className="ant-card-head-title">
                      <FormattedMessage id="text.news" />
                    </div>
                  </div>
                </div>
                <div className="ant-card-body" style={{ height: '700px', overflow: 'auto' }}>
                  <div direction="vertical" className="sc-cCcYRi kmLPwf">
                    <div className="ant-list ant-list-split">
                      <div className="ant-spin-nested-loading">
                        <div className="ant-spin-container">
                          <ul className="ant-list-items">
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/959dbf57-9526-4547-9e77-85f3ad3aa306?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Leaked memo: Facebook details how Apple's privacy change will impact its advertising business</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>Summary List Placement Facebook sent a memo to advertisers April 28 detailing the effects Apple's new privacy settings will have on ad campaigns. The memo, obtained by Insider, elaborates on an April 26 blog post advising advertisers on how to prepare for the change. Facebook warned that the results of their ad campaigns will fluctuate, with the size of audiences shrinking as users gradually update their Apple devices in the coming weeks. Facebook and Instagram will automatically opt those users out of tracking settings. Specifically, the memo says: 1-day click-through opt-out data will be modeled for advertisers. 7-day click-through and 1-day view-through attribution settings will no longer include iOS 14.5 opted-out events. 28-day click-through, 7-day view-through, 28-day view-through attribution tools will no longer be available to advertisers. The memo comes as advertisers brace for big changes from Apple, Google and others that are expected to make it harder for advertisers to target and measure digital ads.</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/a35053cb-1528-4845-bdda-45da701b1cd0?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Apple's Numbers Are 'Jaw-Droppers' According Wedbush's Dan Ives</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>Apple Inc (NASDAQ: AAPL ) continues to prove the skeptics wrong, Wedbush analyst Dan Ives said Wednesday on CNBC's "Closing Bell." What Happened: Apple reported quarterly earnings of $1.40 per share, beating the estimate of 99 cents. Revenue of $89.58 billion beat the estimate of $77.35 billion. The company also added $90 billion to its share … Full story available on Benzinga.com</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/8276cea6-46c7-4c50-9c2e-71956abae66b?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Facebook beats expectations to post positive first quarter earnings</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>Despite a slew of antitrust hearings, an operating system update threat, and reports of a data leak, the company’s revenue rose to $26.17bn Facebook earnings beat analyst expectations Wednesday, bolstered by pandemic-driven traffic and ad sales. The positive earnings report for Facebook comes despite a number of roadblocks for the company in previous months – including a slew of antitrust hearings in the US Congress, an Apple operating system update threatening its advertising revenue and reports of a 2019 data leak that had affected millions of users. Continue reading…</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/c63971e8-c05f-4457-9562-0a5386120352?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Apple’s sales and profits surge amid soaring demand for iPhones, Macs</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>Apple on Wednesday posted sales and profits far ahead of Wall Street expectations and announced a $90 billion share buyback as customers continued to upgrade to 5G iPhones and snapped up new Mac models with Apple’s house-designed processor chips. Sales to China nearly doubled and results topped analyst targets in every category, led by $6.5 billion more…</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/4798254e-e532-4641-a496-fa45c2c13df9?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Apple Retail Pioneer Ron Johnson Lands SPAC Deal For Enjoy Technology: What Investors Should Know</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>A leading telecommunications retail partner for large companies is going public with plans to bring the experience to customer's homes. The SPAC Deal: Enjoy Technology is merging with Marquee Raine Acquisition Corp (NASDAQ: MRAC ) in a deal valuing the company at $1.2 billion. The deal will provide Enjoy with around $450 million in growth capital. Current Marquee Raine Acquisition shareholders will own 23% of the company if the merger is approved. About Enjoy: With strong exclusive relationships with leading consumer brands, Enjoy is a partner for retail efforts. The company’s partners include AT&amp;T (NYSE: T ) in the U.S., BT Group in the U.K., Rogers Communications (NYSE: RCI ) in Canada and Apple Inc (NASDAQ: AAPL ) in … Full story available on Benzinga.com</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/9468ae5b-9595-4a8d-8f8a-5382d0f3469e?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Apple's Q2 Results Exceed Expectations On Strong Product Momentum, Stellar Services Performance</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>Apple Inc. (NASDAQ: AAPL ) shares are solidly higher after the tech giant announced fiscal-year 2021 second-quarter results that exceeded expectations, thanks to better-than-expected iPhone revenues, record contribution by the Services segment and strong showing by the key Greater China region. The company's board authorized a dividend increase and increased share repurchase authorization. Apple's Key Q2 Numbers: Apple reported second-quarter earnings per share of $1.40, up from the year-ago 64 cents. Revenues climbed 54% year-over-year from $58.3 billion to $89.6 billion. The consensus estimates had called for EPS of 99 cents on revenues of $77.35 billion. In the previous quarter that encompassed the key holiday selling season, Apple reported EPS of $1.68 and revenues of $111.4 billion. International sales accounted for 67% of the total revenues in the second quarter compared to 64% in the previous quarter. Gross margin came in at 42.5%, up from 39.8% in the previous quarter. Operating cash flow was at $24 billion. "We are proud of our March quarter performance, which included revenue records in each of our geographic segments and strong double-digit growth in each of our product categories, driving our installed base of active devices …</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/9b99cb90-d6ab-4cfc-9726-5f9a16af7a0c?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Apple sees another quarter of record revenue amid Covid buying surge</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>Company, which brought in $89.6bn, has thrived during the pandemic as consumers bought more products Apple executives announced another quarter of record revenue on Wednesday, with growth driven in large part by a continued surge in sales. Earnings surpassed analysts’ expectations across categories, as sales in China doubled, Mac sales were a third higher than predicted and iPhone sales came in around $48bn – roughly $6.5bn higher than initial estimates. Continue reading…</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/86fbaf1f-3279-4ec0-b7c8-44e4c9476c58?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Facebook Expects ‘Ad-Targeting Headwinds’ From Apple’s Privacy Changes</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>Facebook reported strong first quarter earnings on Wednesday amidst industry-wide concerns around how Apple's latest privacy changes will affect the digital advertising business, a space that Facebook dominates. "We had a strong quarter as we helped people stay connected and businesses grow," said Facebook founder and CEO Mark Zuckerberg. "We will continue to invest aggressively…</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="ant-list-item sc-jcFkyM ihvgJG">
                              <div className="ant-list-item-meta">
                                <div className="ant-list-item-meta-avatar">
                                  <NewsImage preview={false} src="https://cloud.iexapis.com/v1/news/image/8c1139d0-0268-4b1f-a314-8e59205c265f?token=pk_b20aab07428e4450ab62e7361336b8f4" />
                                </div>
                                <div className="ant-list-item-meta-content">
                                  <h4 className="ant-list-item-meta-title">
                                    <div className="ant-space ant-space-horizontal ant-space-align-center" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div className="ant-space-item" style={{ marginRight: '8px' }}><span className="ant-typography news-title" style={{ margin: '0px' }}><strong>Apple starts 2021 strong with $89.6 billion in revenue</strong></span></div>
                                      <div className="ant-space-item">
                                        <div style={{ position: 'relative', top: '4px' }}>
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" style={{ color: 'rgb(50, 115, 164)' }} height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </h4>
                                  <div className="ant-list-item-meta-description">
                                    <div className="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line" style={{ WebkitLineClamp: 3 }}>Apple's steady stream of hardware upgrades and new services launched throughout the pandemic has held the company in good stead going into 2021.</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </main>
      {/* <WalkthroughTour visible={visible} onClose={() => setVisible(false)} /> */}

    </Container>
  );
}

ProMemberPage.propTypes = {
};

ProMemberPage.defaultProps = {};

export default withRouter(ProMemberPage);
