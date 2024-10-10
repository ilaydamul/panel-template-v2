import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Editor } from "primereact/editor";
import RandomNumber from "../RandomNumber";
import FileInput from "../FileInput";

export default function BlogForm({ setRender, setState }) {
  const [text, setText] = useState();
  const [image, setImage] = useState("");
  const fileRef = useRef();

  const [sending, setSending] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      link: "",
      category: "",
    },
    onSubmit: async (values) => {
      const requestData = {
        ...values,
        content: text,
        image: image,
      };

      try {
        setSending(true);
        const response = await axios.post("/addDiscover", requestData);
        if (response.data.insertId) {
          setRender(RandomNumber());
          toast.success("Ekleme Başarılı");

          formik.resetForm();
          setText("");
          setState(false);
          setSending(false);
        } else {
          toast.error("Ekleme Başarısız");
          setSending(false);

          throw new Error("Ekleme işlemi başarısız oldu.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Bir hata oluştu.");
        setSending(false);
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="p-fluid form_style">
          <div className="p-field">
            <label htmlFor="category">Kategori</label>
            <InputText
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              placeholder="Kategori"
            />
          </div>

          <div className="p-field">
            <label htmlFor="title">Blog Adı</label>
            <InputText
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Blog Adı"
            />
          </div>

          <div className="p-field">
            <label style={{ marginLeft: ".25rem" }}>İçerik</label>
            <Editor
              value={text}
              onTextChange={(e) => setText(e.htmlValue)}
              style={{ height: "250px" }}
            />
          </div>

          <div className="p-field">
            <label htmlFor="text">Görsel</label>
            <FileInput fileRef={fileRef} setState={setImage} />
          </div>
        </div>

        <Button
          type="submit"
          label={sending ? "Kaydediliyor..." : "Kaydet"}
          className="w-100"
          disabled={sending}
        />
      </form>
    </div>
  );
}
