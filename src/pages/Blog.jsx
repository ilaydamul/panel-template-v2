import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Column } from "primereact/column";
import { HiPencilAlt } from "react-icons/hi";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "primereact/button";

import Modal from "../components/Modal";
import DTable from "../components/DTable";
import { toast } from "react-toastify";
import { Image } from "primereact/image";
import AddBlogForm from "../components/AdditionForms/BlogForm";
import UpdateBlogForm from "../components/UpdateForms/BlogForm";

export default function Blog() {
  const [data, setData] = useState(null);
  const [render, setRender] = useState(null);

  const [contentEvent, showContentEvent] = useState(null);

  const [updateModal, setUpdateModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  //   const [changeData, setChangeData] = useState(null);

  const [changeId, setChangeId] = useState(null);

  useEffect(() => {
    axios.get("/discover").then((res) => {
      setData(res.data);
    });
  }, [render]);

  const updateAct = (id) => {
    setChangeId(id);
    setUpdateModal(!updateModal);
  };

  const removeData = (id, image) => {
    Swal.fire({
      title: "Blog silinecek",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sil",
      cancelButtonText: "İptal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("/removeDiscover", { id, image })
          .then((res) => {
            console.log(res.data);
            toast.success("Blog başarıyla silindi!");
            setRender(!render);
          })
          .catch((error) => {
            console.error(error);
            toast.error("Blog silinirken bir hata oluştu.");
          });
      }
    });
  };

  const activityBodyTemplate = (rowData) => {
    return (
      <div className="table_buttons">
        <Button
          label={<HiPencilAlt />}
          onClick={() => updateAct(rowData.id)}
          severity="secondary"
        />
        <Button
          label={<FaRegTrashCan />}
          onClick={() => removeData(rowData.id, rowData.image)}
          severity="danger"
        />
      </div>
    );
  };

  const contentBodyTemplate = (rowData) => {
    return (
      <Button
        label={"İçeriği Göster"}
        onClick={() => {
          showContentEvent(rowData.content);
          setShowModal(true);
        }}
        className="content_show_btn"
        severity="secondary"
      />
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <Image
        src={rowData.image}
        alt={rowData.title}
        style={{ maxWidth: "120px", width: "100%" }}
        preview
      />
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-end gap-2 mb-4">
        <Button
          label="Blog Ekle"
          style={{ marginLeft: "0" }}
          className="addButton"
          onClick={() => setAddModal(true)}
        />
      </div>

      <DTable data={data}>
        <Column body={imageBodyTemplate} header="Görsel"></Column>
        <Column field="title" header="Blog Adı"></Column>
        <Column body={contentBodyTemplate} header="İçerik"></Column>
        <Column body={activityBodyTemplate} header="İşlemler"></Column>
      </DTable>

      <Modal state={addModal} setState={setAddModal} title={"Blog Ekle"}>
        <AddBlogForm setState={setAddModal} setRender={setRender} />
      </Modal>

      <Modal
        state={showModal}
        setState={setShowModal}
        title={"Blog İçeriği"}
      >
        <div dangerouslySetInnerHTML={{ __html: contentEvent }} />
      </Modal>

      <Modal
        state={updateModal}
        setState={setUpdateModal}
        title={"Blog Güncelle"}
      >
        <UpdateBlogForm
          id={changeId}
          setState={setUpdateModal}
          setRender={setRender}
        />
      </Modal>
    </div>
  );
}
