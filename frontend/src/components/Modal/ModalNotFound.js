import Modal from './Modal'
import { Error } from '../Icons/Status'

const ModalNotFound = ({ msg, status = Error }) => {
  msg = `نعتذر على الازعاج، لكن يبدو أن الصفحة التي تبحث عنها غير متواجدة! أو أنك أخطأت في كتابة اسم الصفحة! للعودة للصفحة الرئيسية إضغط الزر أدناه`

  return <Modal status={status} msg={msg} btnName='الصفحة الرئيسية' btnLink='/' />
}

export default ModalNotFound
