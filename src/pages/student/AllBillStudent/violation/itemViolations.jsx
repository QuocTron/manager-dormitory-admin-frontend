import Moment from 'moment';
import './itemViolationStyle.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useRef, useState } from 'react';
import { showToastError, showToastSuccess } from '~/lib/showToastMessage';
import { createAxios } from '~/lib/createAxios';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '~/redux/authSlice';
import FormDialogDelete from '../../../allBillStudent/allDialogForm/FormDialogDelete';
import FormDialogDestroy from '~/pages/allBillStudent/allDialogForm/FormDialogDestroy';

const API = 'https://nqt-server-dormitory-manager.herokuapp.com/api/v1/';

function ItemViolationRecord(props) {
  const { violation, popup } = props;
  const [violationRecord, setViolationRecord] = useState(violation);
  const close = popup?.current.close;
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogDestroy, setOpenDialogDestroy] = useState(false);

  const navigate = useNavigate();
  const { id_student } = useParams();
  let date = new Date();
  const formatNumber = (q) => {
    return q.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const linkRef = useRef();
  const handleOpenDialogDelete = () => {
    setOpenDialogDelete(!openDialogDelete);
  };
  const handleOpenDialogDestroy = () => {
    setOpenDialogDestroy(!openDialogDestroy);
  };
  const handleShowAllFollowStudent = () => {
    navigate(`/admin/student/violations/${violationRecord?.student._id || id_student}`);
  };

  const handleNotificationMail = async () => {
    try {
      popup.isChange = true;
      const res = await axiosJWT.post(
        `${API}violationRecord/notification-email-violation-record/${violationRecord?._id}`,
        {},
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      setViolationRecord(res.data.violationRecord);
      showToastSuccess(res.data.message, 5000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handlePaymentVIolationRecord = async () => {
    try {
      popup.isChange = true;
      const res = await axiosJWT.post(
        `${API}violationRecord/pay-fines-by-staff/${violationRecord?._id}`,
        {},
        {
          headers: { token: `Bearer ${user?.accessToken}` },
        },
      );
      setViolationRecord(res.data.violationRecord);
      showToastSuccess(res.data.message, 5000);
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };

  const handleShowMoMo = async () => {
    try {
      const res = await axios.get(`${API}billCostOfLiving/show-momo-payment/62a84e6769d987af49159d4e`);
      console.log(res.data.urlMoMo);
      linkRef.current.href = res?.data?.urlMoMo;
      linkRef.current.click();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteViolationRecord = async () => {
    try {
      setOpenDialogDelete(false);
      const res = await axios.delete(`${API}violationRecord/delete/${violationRecord?._id}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      popup.isChange = true;
      showToastSuccess(res.data.message);
      close();
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handleDestroyViolationRecord = async () => {
    try {
      setOpenDialogDelete(false);
      const res = await axios.delete(`${API}violationRecord/destroy/${violationRecord?._id}`, {
        headers: { token: `Bearer ${user?.accessToken}` },
      });
      popup.isChange = true;
      showToastSuccess(res.data.message);
      close();
    } catch (error) {
      showToastError(error.response.data.message, 10000);
    }
  };
  const handCreateNewViolationRecord = () => {
    navigate(`/admin/student/create/violation/${violationRecord?.student._id || id_student}`);
  };
  return (
    <div className="content-right content-right-violation">
      <div className="box-title-violation">
        <span className="title-violation-title">Th??ng tin chi ti???t phi???u ph???t </span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Sinh vi??n vi ph???m: </span>
        <span className="itemValue"> {violationRecord?.student?.nameStudent}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">N???i dung vi ph???m: </span>
      </div>
      <div className="detail-cost-living detailItem">
        {violation?.contentViolation?.map((violation) => (
          <div className="item-violation">
            <div className="name-cost-spending">
              <span className="itemTitleCost">N???i dung ph???t: </span>
              <span className="itemValueCost "> {violation?.itemViolation?.nameRule}</span>
            </div>
            <div className="amount-use-spending">
              <div className="amount-use">
                {' '}
                <span className="itemTitleCost">S??? l???n qui ph???m: </span>
                <span className="itemValueCost "> {violation?.amountViolation}</span>
              </div>

              <div className="amount-use">
                {' '}
                <span className="itemTitleCost">H??nh ph???t: </span>
                <span className="itemValueCost "> {violation?.itemViolation?.overcome}</span>
              </div>
            </div>
            <div className="total-price">
              <span className="itemTitleCost">S??? ti???n: </span>
              <span className="itemValueCost itemValue">
                {' '}
                {formatNumber(violation?.itemViolation?.monetaryFine)}/vi ph???m
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="detailItem">
        <span className="itemKey">T???ng ti???n: </span>
        <span className="itemValue"> {formatNumber(violationRecord?.totalViolationRecord)}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Tr???ng th??i: </span>
        <span
          className="itemValue"
          style={violationRecord?.statusBill !== true ? { color: 'red', fontSize: '14px', fontWeight: 'bold' } : {}}
        >
          {violationRecord?.statusBill === true ? '???? ????ng ph???t' : 'Ch??a ????ng ph???t'}
        </span>
        {!violationRecord?.statusBill && (
          <div className="btn-notification-payment">
            <button className="btn-violation-record" onClick={handlePaymentVIolationRecord}>
              ????ng ph???t
            </button>
            <button className="btn-violation-record btn-notification-email" onClick={handleNotificationMail}>
              {!violationRecord?.isNotification ? 'C???nh b??o' : 'C???nh b??o l???i'}
            </button>
          </div>
        )}
      </div>
      <div className="detailItem">
        <span className="itemKey">Ng??y l???p bi??n b???n: </span>
        <span className="itemValue">{Moment(violationRecord?.createdAt).format('DD-MM-YYYY')}</span>
      </div>
      <div className="detailItem item-staff-create">
        <span className="itemKey">Nh??n vi??n th??nh l???p: </span>
        <span className="itemValue"> {violationRecord?.staffCreate?.nameStaff}</span>
      </div>
      <div className="detailItemBtn">
        {id_student && (
          <button className="btn-show-all" onClick={handleShowAllFollowStudent}>
            Xem th??m<main></main>
          </button>
        )}
        {violationRecord?.statusBill &&
          (!violationRecord?.deleted ? (
            <button className="btn-show-all" onClick={handleOpenDialogDelete}>
              X??a{' '}
            </button>
          ) : (
            <button className="btn-show-all" onClick={handleOpenDialogDestroy}>
              X??a v??nh vi???n{' '}
            </button>
          ))}
        <button className="btn-show-all" onClick={handCreateNewViolationRecord}>
          L???p bi??n b???n{' '}
        </button>
        <a ref={linkRef} target="_blank" href=" " style={{ display: 'none' }}></a>
        {openDialogDelete && (
          <FormDialogDelete
            open={openDialogDelete}
            onOpenDialog={handleOpenDialogDelete}
            onAgreeAction={handleDeleteViolationRecord}
          />
        )}
        <FormDialogDestroy
          open={openDialogDestroy}
          onOpenDialog={handleOpenDialogDestroy}
          onAgreeAction={handleDestroyViolationRecord}
        />
      </div>
    </div>
  );
}
export default ItemViolationRecord;
