import React from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Typography, Button, Space, Form, Input, Modal, Layout, InputNumber, Row, Col, Card } from 'antd';
import { Logo } from 'components/Logo';
import { signUp } from 'services/authService';
import { GlobalContext } from 'contexts/GlobalContext';
import GoogleSsoButton from 'components/GoogleSsoButton';
import GoogleLogoSvg from 'components/GoogleLogoSvg';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { saveProfile } from 'services/userService';
import { notify } from 'util/notify';
import { LocaleSelector } from 'components/LocaleSelector';
import { CountrySelector } from 'components/CountrySelector';
import {
  deleteStock, getStock, saveStock,
  listStockSupport, saveStockSupport, deleteStockSupport,
  listStockResistance, saveStockResistance, deleteStockResistance,
  listStockPe, saveStockPe, deleteStockPe,
  listStockEps, saveStockEps, deleteStockEps,
  listStockValue, saveStockValue, deleteStockValue,
  listStockPublish, saveStockPublish,
} from 'services/stockService';
import { Loading } from 'components/Loading';
import { StockName } from 'components/StockName';
import { publishEvent } from 'services/eventSevice';
import { Divider } from 'antd';

import { DeleteOutlined, EditOutlined, EllipsisOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import { StockRangeTimelineEditor } from './StockRangeTimelineEditor';
import { StockEpsTimelineEditor } from './StockEpsTimelineEditor';
import { StockValueTimelineEditor } from './StockValueTimelineEditor';
import { StockPublishTimelineEditor } from './StockPublishTimelineEditor';
import { PageHeader } from 'antd';
import { Select } from 'antd';
import { listStockTags } from 'services/stockTagService';
import StockTag from 'components/StockTag';
import StockTagSelect from 'components/StockTagSelect';
import { Drawer } from 'antd';
const { Title, Text, Paragraph } = Typography;


const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  // background-color: #f3f3f3;

  .ant-page-header {
    padding-left: 0;
    padding-right: 0;
  }

  .ant-list-item {
    padding-left: 0;
    padding-right: 0;
  }
`;

const ColStyled = styled(Col)`
  margin-bottom: 20px;
  // background-color: #f3f3f3;
`;

// const ColInnerCard = styled(Card)`
// height: 100%;
// `;

const ColInnerCard = props => (
  <Card
    size="small"
    type="inner"
    {...props}
    style={{ height: '100%' }}
  >
    {props.children}
  </Card>
)

const LogoContainer = styled.div`
  margin-bottom: 2rem;
`;

const LayoutStyled = styled(Layout)`
  margin: 0 auto 0 auto;
  background-color: #ffffff;
  height: 100%;
`;

const span = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 8
};

const StockForm = (props) => {
  const { symbol, onOk } = props;
  const formRef = React.createRef();
  const [loading, setLoading] = React.useState(true);
  const [simulatorVisible, setSimulatorVisible] = React.useState(false);
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [publishingPrice, setPublishingPrice] = React.useState(false);
  const [stock, setStock] = React.useState();
  const [sourceEps, setSourceEps] = React.useState();
  const [sourcePe, setSourcePe] = React.useState();
  const [supportList, setSupportList] = React.useState();
  const [resistanceList, setResistanceList] = React.useState();
  const [valueList, setValueList] = React.useState();

  const loadEntity = async () => {
    try {
      setLoading(true);
      setStock(await getStock(symbol));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadEntity();
  }, []);

  const handleSave = async (values) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const stock = { ...values, tags: values.tags?.map(t => t.id) };
      await saveStock(stock);
      setDrawerVisible(false);
      await loadEntity();

      notify.success('Successfully saved stock!');

    } finally {
      setLoading(false);
    }
  }

  const handleSaveForm = async (propName, e) => {
    const newStock = {
      ...stock,
      [propName]: e
    }

    newStock.tags = newStock.tags.map(t => t.id || t);

    try {
      setLoading(true);
      await saveStock(newStock);
      await loadEntity();
    } finally {
      setLoading(false);
    }
  }

  const handleValuesChange = (changedValues, allValues) => {
    console.log(changedValues);
  }

  const handleCancel = () => {
    props.history.push('/stock');
  }

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Stock",
      content: <>Do you want delete <Text strong>{stock.symbol} ({stock.company})</Text>?</>,
      async onOk() {
        await deleteStock(stock.symbol);
        onOk();
      },
      maskClosable: true,
      okText: 'Yes, Delete!',
      okButtonProps: {
        type: 'danger'
      },
      onCancel() {
      },
    });
  }

  const handlePublishMarketPrice = async (values) => {
    const { price } = values;
    try {
      setPublishingPrice(true);

      const event = {
        type: 'market-price',
        symbol,
        price,
        by: 'simulator'
      };
      await publishEvent(event);
      notify.success(`Publishing market price at $${price}`);

    } finally {
      setPublishingPrice(false);
    }
  }

  const handlePublish = async () => {
    try {
      setLoading(true);
      const payload = {
        supportId: supportList[0].id,
        resistanceId: resistanceList[0].id,
        valueId: valueList[0].id
      };
      await saveStockPublish(symbol, payload);
    } finally {
      setLoading(false);
    }
  }

  if (symbol && !stock) {
    return <Loading />
  }


  return (<Container>
    <PageHeader
      onBack={handleCancel}
      title={<StockName value={stock} />}
      extra={[
        <Button key="1" disabled={loading} onClick={() => loadEntity()} icon={<SyncOutlined />} />,
        <Button key="0" type="danger" disabled={loading} onClick={handleDelete} icon={<DeleteOutlined />}></Button>,
        <Button key="2" disabled={loading} onClick={() => setDrawerVisible(true)} icon={<EditOutlined />} />
      ]}
    />
    <Row gutter={20}>
      <ColStyled {...span}>
        <ColInnerCard title="EPS">
          <StockEpsTimelineEditor
            onLoadList={() => listStockEps(symbol)}
            onSaveNew={values => saveStockEps(symbol, values)}
            onDelete={id => deleteStockEps(id)}
            onChange={list => setSourceEps(list.slice(0, 4))}
          />
        </ColInnerCard>
      </ColStyled>
      <ColStyled {...span}>
        <ColInnerCard title="PE">
          <StockRangeTimelineEditor
            onLoadList={() => listStockPe(symbol)}
            onSaveNew={([lo, hi]) => saveStockPe(symbol, lo, hi)}
            clickable={false}
            onChange={list => setSourcePe(list[0])}
            onDelete={id => deleteStockPe(id)}
          />
        </ColInnerCard>
      </ColStyled>
      <ColStyled {...span}>
         <ColInnerCard title="Fair Value">
         {(sourceEps && sourcePe) ? <StockValueTimelineEditor
            onLoadList={() => listStockValue(symbol)}
            onSaveNew={payload => saveStockValue(symbol, payload)}
            onDelete={id => deleteStockValue(id)}
            onChange={list => setValueList(list)}
            clickable={true}
            sourceEps={sourceEps}
            sourcePe={sourcePe}
          /> : <Alert type="warning" message="Please setup EPS and PE before setting Fair Value" showIcon/>}
        </ColInnerCard>
      </ColStyled>
      <ColStyled {...span}>
        <ColInnerCard title="Support">
          <StockRangeTimelineEditor
            onLoadList={() => listStockSupport(symbol)}
            onSaveNew={([lo, hi]) => saveStockSupport(symbol, lo, hi)}
            onDelete={id => deleteStockSupport(id)}
            onChange={list => setSupportList(list)}
          />
        </ColInnerCard>
      </ColStyled>
      <ColStyled {...span}>
        <ColInnerCard title="Resistance">
          <StockRangeTimelineEditor
            onLoadList={() => listStockResistance(symbol)}
            onSaveNew={([lo, hi]) => saveStockResistance(symbol, lo, hi)}
            onDelete={id => deleteStockResistance(id)}
            onChange={list => setResistanceList(list)}
          />
        </ColInnerCard>
      </ColStyled>
      <ColStyled {...span}>
        <ColInnerCard title="Publish History">
          <StockPublishTimelineEditor
            onLoadList={() => listStockPublish(symbol)}
            onPublishNew={() => handlePublish()}
          />
        </ColInnerCard>
      </ColStyled>
    </Row>

    <Modal
      visible={simulatorVisible}
      destroyOnClose={true}
      closable={true}
      maskClosable={false}
      title={<StockName value={stock} />}
      onCancel={() => setSimulatorVisible(false)}
      onOk={() => setSimulatorVisible(false)}
      footer={null}
    >
      <Paragraph type="secondary">Publishing price in here will broadcast to all online clients.</Paragraph>
      <Form
        onFinish={handlePublishMarketPrice}
      >
        <Form.Item label="Market Price" name="price" rules={[{ required: true, type: 'number', whitespace: true, min: 0, message: ' ' }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={publishingPrice}>Publish</Button>
        </Form.Item>
      </Form>
      <Button block type="link" onClick={() => setSimulatorVisible(false)}>Cancel</Button>
    </Modal>


    <Drawer
      visible={drawerVisible}
      destroyOnClose={true}
      closable={true}
      maskClosable={true}
      title={<StockName value={stock} />}
      width={300}
      onClose={() => setDrawerVisible(false)}
      footer={
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* <Button block type="primary" disabled={loading} onClick={() => formRef.current.submit()}>Save</Button> */}
          {/* <Button block onClick={() => setDrawerVisible(false)}>Cancel</Button> */}
          <Button block disabled={loading} onClick={() => setSimulatorVisible(true)}>Set Market Price</Button>
        </Space>
      }
    >
      <Form
        layout="vertical"
        ref={formRef}
        // onFinish={handleSave}
        // onValuesChange={handleValuesChange}
        // style={{ textAlign: 'left' }}
        initialValues={stock}>
        <Form.Item label="Symbol" name="symbol" rules={[{ required: true, whitespace: true, message: ' ' }]}>
          <Input placeholder="Stock symbol" allowClear={true} maxLength="100" onBlur={e => handleSaveForm('symbol', e.target.value)} disabled={true} readOnly={true} />
        </Form.Item>
        <Form.Item label="Company Name" name="company" rules={[{ required: true, whitespace: true, message: ' ' }]}>
          <Input placeholder="Company name" autoComplete="family-name" allowClear={true} maxLength="100" onBlur={e => handleSaveForm('company', e.target.value)} />
        </Form.Item>
        <Form.Item label="Tags" name="tags" rules={[{ required: false }]}>
          <StockTagSelect onChange={tags => handleSaveForm('tags', tags.map(t => t.id))} />
        </Form.Item>
      </Form>
    </Drawer>
  </Container >);
}

StockForm.propTypes = {
  symbol: PropTypes.string.isRequired
};

StockForm.defaultProps = {
};

export default withRouter(StockForm);
