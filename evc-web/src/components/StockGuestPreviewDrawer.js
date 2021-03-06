import React from 'react';
import { Drawer, Button, Typography, Alert, Space } from 'antd';
import { getStockForGuest } from 'services/stockService';
import { StockName } from 'components/StockName';
import PropTypes from "prop-types";
import StockDisplayPanel from './StockDisplayPanel';
import { Loading } from 'components/Loading';
import { FormattedMessage } from 'react-intl';
import { from } from 'rxjs';
import {
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Text } = Typography;


export const StockGuestPreviewDrawer = (props) => {
  const { symbol, visible: propVisible, onClose } = props;

  const [stock, setStock] = React.useState();
  const [visible, setVisible] = React.useState(propVisible);

  React.useEffect(() => {
    setVisible(propVisible)
  }, [propVisible]);

  const loadEntity = async () => {
    // const { data: toSignTaskList } = await searchTask({ status: ['to_sign'] });
    try {
      const stock = symbol ? await getStockForGuest(symbol) : null;
      setStock(stock);
    } catch {
      onClose();
    }
  }

  React.useEffect(() => {
    const load$ = from(loadEntity()).subscribe();
    return () => {
      load$.unsubscribe();
    }
  }, [symbol]);

  return (
    <Drawer
      visible={visible}
      bodyStyle={{
        backgroundColor: 'rgb(240, 242, 245)'
      }}
      placement="bottom"
      closable={true}
      maskClosable={true}
      destroyOnClose={true}
      onClose={onClose}
      footer={null}
      title={<Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Text>{stock ? <StockName value={stock} /> : symbol}</Text>
        <Alert
          showIcon
          icon={<InfoCircleOutlined />}
          description={<Text style={{ marginLeft: 12 }} type="success">More information is available to signed up users</Text>}
          action={
            <Link to="/signup">
              <Button type="primary" style={{ width: 140 }}>
                <FormattedMessage id="menu.signUpNow" />
              </Button>
            </Link>
          }
          type="success" />
      </Space>}
      height="85vh"
    >

      {stock ? <StockDisplayPanel stock={stock} /> : <Loading loading={true} />}
    </Drawer>
  );
};

StockGuestPreviewDrawer.propTypes = {
  symbol: PropTypes.string,
};

StockGuestPreviewDrawer.defaultProps = {};

export default StockGuestPreviewDrawer;
