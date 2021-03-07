import React, { useContext } from 'react';
import styled from 'styled-components';
import { Typography, Button, Space, Row, Col, Modal, Drawer } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size'
import { GlobalContext } from 'contexts/GlobalContext';
import GoogleSsoButton from 'components/GoogleSsoButton';
import GoogleLogoSvg from 'components/GoogleLogoSvg';
import { StockSearchInput } from 'components/StockSearchInput';
import { LocaleSelector } from 'components/LocaleSelector';
import ReactDOM from 'react-dom';
import StockFreePage from 'pages/StockPage/StockFreePage';

const { Title, Paragraph } = Typography;


const Container = styled.div`
// border-bottom: 1px solid #f0f0f0;
// background: #092b00;
background-image: linear-gradient(160deg, #3273A4, #15be53);
// background-image: linear-gradient(#135200, #15be53);
// background-image: linear-gradient(150deg, #135200, #135200 25%, #15be53 25%, #15be53 50%, #15bead 50%, #15bead 75%, #18b0d7 75%, #18b0d7 100%);
background-image: linear-gradient(150deg, #18b0d7, #18b0d7 25%, #67ddf0 25%, #67ddf0 50%, #5dd982 50%, #5dd982 75%, #15be53 75%, #15be53 100%);
// background-image: linear-gradient(150deg, #ffffff, #ffffff 25%, #18b0d7 25%, #18b0d7 50%, #5dd982 50%, #5dd982 75%, #15be53 75%, #15be53 100%);
// background-image: linear-gradient(150deg, #ffffff, #ffffff 25%, #18b0d7 25%, #18b0d7 50%, #15be53 50%, #15be53 75%, #f0f0f0 75%, #f0f0f0 100%);
// background: linear-gradient(to bottom, rgba(19,82,0,0.9), rgba(9,43,0, 0.7)), url('/images/poster.jpg') center center repeat;
margin: 0 auto 0;
padding: 0 2rem 2rem 2rem;
width: 100%;
// height: 100%;
.signup-panel .ant-typography {
  // color: rgba(255,255,255,1) !important;
}

.ant-select-selector {
  border-radius: 40px !important;
  padding:0 20px !important;
  // height: 50px !important;

  .ant-select-selection-search {
    left: 20px;
  }
}
`;

const InnerContainer = styled.div`
margin-left: auto;
margin-right: auto;
width: 100%;
max-width: 1200px;

.top-menu {
  .ant-select, .ant-btn-link {
    color: rgba(0,0,0,0.8) !important;

    .ant-select-arrow {
      color: rgba(0,0,0,0.8) !important;
    }
    &:hover {
      color: black !important;
    }
  }
}
`;

const LogoPlate = styled.div`
margin: 4px 0 0;
padding: 8px;
// background-image: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.95), rgba(255,255,255,0.75));
// border-radius: 2px;
`;

const SignUpButton = styled(Button)`
// background-color: white !important;
`;

const HomeCarouselAreaRaw = props => {

  const windowWidth = useWindowWidth();
  const context = useContext(GlobalContext);
  const [resultStockSymbol, setResultStockSymbol] = React.useState();
  const [stockModalVisible, setStockModalVisible] = React.useState(false);


  const catchPhraseSize = windowWidth < 576 ? 32 :
    windowWidth < 992 ? 40 :
      48;

  const handleSignOn = () => {
    props.history.push('/signup')
  }

  const handleSearchChange = async symbol => {
    if (symbol) {
      ReactDOM.unstable_batchedUpdates(() => {
        setResultStockSymbol(symbol);
        setStockModalVisible(true);
      })
    }
  }

  const span = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
    xxl: 24
  };

  return (
    <Container>
      <InnerContainer>
        <Space className="top-menu" size="middle" style={{ width: '100%', justifyContent: 'space-between' }}>
          <LogoPlate>
            <img alt="EasyValueCheck logo" src="/images/header-logo.png" width="auto"
              height="30"></img>

          </LogoPlate>

          <Space>
            <Link to="/"><Button size="large" type="link">Blog</Button></Link>
            <Link to="/signup"><Button size="large" type="link">Sign Up</Button></Link>
            <Link to="/login"><Button size="large" type="link">Login</Button></Link>
            <LocaleSelector bordered={false} style={{ color: 'white', width: 130 }} size="large" defaultValue="en-US" />
          </Space>
        </Space>
        <Row gutter={20} style={{ marginTop: 50 }}>
          <Col className="signup-panel" {...span} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Title style={{ fontSize: catchPhraseSize, marginLeft: 'auto', marginRight: 'auto' }}>Easy Value Check</Title>
            <Paragraph level={3} style={{ fontSize: catchPhraseSize * 0.4, marginLeft: 'auto', marginRight: 'auto' }}>Easy Value Check provides top class invstiment guidence to earn more money on the market! Go go go! Sign up today!</Paragraph>
            <div style={{ maxWidth: 550, margin: '2rem auto' }}>
              <StockSearchInput onChange={handleSearchChange} traceSearch={true} />
            </div>
            <Space align="center" style={{ marginLeft: 'auto', marginRight: 'auto', width: '100%', justifyContent: 'center' }} >
              <SignUpButton type="primary" onClick={() => handleSignOn()}>Sign Up with Email</SignUpButton>
              <GoogleSsoButton
                render={
                  renderProps => (
                    <Button
                      type="secondary"
                      block
                      icon={<GoogleLogoSvg size={16} />}
                      // icon={<GoogleOutlined />}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >Continue with Google</Button>
                  )}
              />
            </Space>

          </Col>
          {/* <Col {...span} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <SearchPanel direction="vertical" >
              <StockMostSearched onFetch={listHotStock} title="most searched" />
            </SearchPanel>
          </Col> */}
        </Row>

        {/* <LogoTextDark /> */}
        {/* <Title level={2} style={{ marginTop: 0, fontWeight: 300, fontSize: Math.max(catchPhraseSize * 0.5, 14) }}>
        We are providing professional accounting and tax services to our clients including individuals, Sole traders, Partnerships, Companies, Trusts etc.
        You’ve got the skills and the experience. We’ve got diverse projects and meaningful work. Let’s take your career to the next level.
              </Title> */}

      </InnerContainer>
      <Drawer
        visible={stockModalVisible}
        placement="bottom"
        closable={true}
        maskClosable={true}
        destroyOnClose={true}
        onClose={() => setStockModalVisible(false)}
        footer={null}
        title={null}
        height="95vh"
      >
        <StockFreePage symbol={resultStockSymbol} />
      </Drawer>
    </Container>
  );
}

HomeCarouselAreaRaw.propTypes = {};

HomeCarouselAreaRaw.defaultProps = {};

export const HomeCarouselArea = withRouter(HomeCarouselAreaRaw);

export default HomeCarouselArea;
