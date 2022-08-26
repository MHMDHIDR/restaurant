import { useRef } from 'react'
import { Link } from 'react-router-dom'
import ReactToPrint from 'react-to-print'

export const AcceptBtn = ({ id, email }) => (
  <button
    id='acceptOrder'
    data-id={id}
    data-status='accept'
    data-email={email}
    className='m-1 px-2 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 min-w-[7rem] relative text-center overflow-hidden'
    data-tooltip='موافقة الطلب'
  >
    <span className='py-0.5 px-1 md:pl-1 bg-green-300 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#9989;
    </span>
    <span className='mr-4 pointer-events-none'>موافقة</span>
  </button>
)

export const EditBtn = ({ id }) => (
  <Link
    to={`/dashboard/edit-order/${id}`}
    id='editOrder'
    className='m-1 px-2 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700 min-w-[7rem] relative text-center overflow-hidden border'
    data-tooltip='تعديل الطلب'
  >
    <span className='py-0.5 px-1 md:pl-1 bg-gray-300 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#9997;
    </span>
    <span className='mr-4 pointer-events-none'>تعديل</span>
  </Link>
)

export const RejectBtn = ({ id, email }) => (
  <button
    id='rejectOrder'
    data-id={id}
    data-status='reject'
    data-email={email}
    className='m-1 px-2 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700 min-w-[7rem] relative text-center overflow-hidden border'
    data-tooltip='رفض الطلب'
  >
    <span className='py-0.5 px-1 md:pl-1 bg-gray-300 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#10060;
    </span>
    <span className='mr-4 pointer-events-none'>رفض</span>
  </button>
)

export const DeleteBtn = ({ id, email }) => (
  <button
    id='deleteOrder'
    data-id={id}
    data-status='delete'
    data-email={email}
    className='m-1 px-2 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 min-w-[7rem] relative text-center overflow-hidden'
    data-tooltip='حذف الطلب'
  >
    <span className='py-0.5 px-1 md:pl-1 bg-red-200 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#128465;
    </span>
    <span className='mr-4 pointer-events-none'>حذف</span>
  </button>
)
