import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Typography, Col, Row, Button, Alert, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { SubscriptionCard } from 'components/SubscriptionCard';
import { GiCurvyKnife, GiFireAxe, GiSawedOffShotgun, GiPirateCannon } from 'react-icons/gi';
import { VscRocket } from 'react-icons/vsc';
import { AiOutlineHome } from 'react-icons/ai';
import { subscriptionDef } from 'def/subscriptionDef';
import StockRadarPage from 'pages/Stock/StockRadarPage';
import { Link, withRouter } from 'react-router-dom';

const { Text, Title } = Typography;

const StyledRow = styled(Row)`
  margin-top: 10px;
`;

const StyledCol = styled(Col)`
  margin-bottom: 20px;
`;

const span = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 8,
  xl: 8,
  xxl: 8
};

const Container = styled.div`
justify-content: center;
margin-bottom: 0rem;
width: 100%;
text-align: center;
padding: 4rem 2rem;
background: #ffffff;
background-image: linear-gradient(-30deg, #18b0d7, #18b0d7 25%, #67ddf0 25%, #67ddf0 50%, #5dd982 50%, #5dd982 75%, #15be53 75%, #15be53 100%);
`;

const InnerContainer = styled.div`
margin-left: auto;
margin-right: auto;
width: 100%;
border: 1px solid #f0f0f0;
padding: 2rem;
background: rgb(240, 242, 245);
// filter: contrast(0.6);
// transform: scale(0.8);

// max-width: 1200px;
`;


export const HomeStockRadarArea = props => {
  const { onSymbolClick } = props;
  return (
    <Container>
      <Space direction="vertical" size="large" style={{ width: '100%', marginBottom: 30 }}>
        <Title>Stock Radar - Preview</Title>
        <Alert
          message={<>
          <Text style={{ fontStyle: 'italic', marginLeft: 12 }} type="success">
            This is Stock Radar preview. 
            Full feature is available after sign up! 
          </Text>
            <big> 😉 </big>
            <Link to="/signup">Sign Up Now</Link>
          </>}
          type="success" 
          style={{marginBottom: 20}}
          />
      </Space>
      <InnerContainer>
        <StockRadarPage onItemClick={onSymbolClick} />
      </InnerContainer>
    </Container>
  )
}

HomeStockRadarArea.propTypes = {
  onSymbolClick: PropTypes.func,
};

HomeStockRadarArea.defaultProps = {
  onSymbolClick: () => { }
};