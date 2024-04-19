import { Button, Space, theme, Table, Modal, message } from 'antd'
import { useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { useMount } from 'ahooks'
import { services } from '@box-project/sdk-services'
import { formatTimeStr } from '@box-project/sdk-utils'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export const PageRoles = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const handleDle = (id: number) => {
    confirm({
      title: 'confirm deletion ?',
      icon: <ExclamationCircleOutlined />,
      content: 'This operation is irreversible.',
      onOk() {
        console.log('OK')
        services.permission$role$delete({ id }).then((hr) => {
          if (hr.data.success) {
            message.success('success')
          } else {
            message.error('failure')
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const [columns, setColumns] = useState<ColumnsType<any>>([
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button type="link" onClick={() => {}}>
              update
            </Button>
            <Button
              type="link"
              onClick={() => {
                handleDle(record.id)
              }}
            >
              delete
            </Button>
            <Button type="link" onClick={() => {}}>
              grant permission
            </Button>
          </Space>
        )
      },
    },
  ])

  const [data, setData] = useState<any[]>()

  const updateTable = async () => {
    const hr = await services.permission$role$list()
    setData(
      hr.data.resource.map((item) => {
        return { ...item, createdAt: formatTimeStr(item.createdAt) }
      }),
    )
  }

  useMount(() => {
    updateTable()
  })

  return (
    <div
      style={{
        padding: 24,
        background: colorBgContainer,
      }}
    >
      <Space size="middle" style={{ padding: '15px' }}>
        <Button type="primary">create</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ position: ['bottomCenter'], hideOnSinglePage: true }}
        size="small"
      />
    </div>
  )
}

export default PageRoles
