import React from "react";
import { FileUpload } from "primereact/fileupload";

export default function FileInput({ image, fileRef, setState }) {
  const customBase64Uploader = async (event) => {
    const file = event.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function () {
      const base64data = reader.result;
      setState(base64data);

      fileRef.current.clear();
      fileRef.current.setUploadedFiles([file]);
    };
  };

  const removeFile = () => {
    fileRef.current.clear();
    setState("");
  };

  return (
    <>
      <FileUpload
        name="image"
        ref={fileRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        maxFileSize={2100000}
        previewWidth={100}
        emptyTemplate={
          <p className="m-0">
            {image
              ? "Mevcut görseli değiştirmek için yeni görsel yükleyin"
              : "Yüklemek istediğiniz görseli buraya sürükleyip bırakın"}
          </p>
        }
        chooseLabel="Dosya Seç"
        uploadLabel="Dosyayı Onayla"
        cancelLabel="Sil"
        invalidFileSizeMessageDetail="(2MB)"
        invalidFileSizeMessageSummary="Seçilen dosyanın boyutu maximum limiti aşıyor"
        customUpload
        uploadHandler={customBase64Uploader}
        onRemove={removeFile}
      />
    </>
  );
}
