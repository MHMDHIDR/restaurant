import { useParams } from 'react-router-dom'

const DashboardOrdersEdit = () => {
  return (
    <div className='text-center text-3xl my-10'>
      جار تعديل الطلب رقم : {useParams().orderId}
    </div>
  )
}

export default DashboardOrdersEdit
