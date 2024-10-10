import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Editor } from "primereact/editor";
import RandomNumber from "../RandomNumber";
import FileInput from "../FileInput";

export default function BlogForm({ setRender, id }) {
  const [text, setText] = useState("");

  const [image, setImage] = useState("");
  const [originImage, setOriginImage] = useState("");
  const fileRef = useRef();

  const [sending, setSending] = useState(false);

  // Fetch the existing data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSending(true);
        const response = await axios.get(`/webLocations/${id}`);
        const data = response.data;
        formik.setValues({
          title: data.title,
          link: data.link,
          category: data.category,
        });

        setText(data.content);
        setOriginImage(data.image);
        setImage(data.image);
        setSending(false);
      } catch (error) {
        console.error("Error fetching the data:", error);
        toast.error("Veri alınırken bir hata oluştu.");
        setSending(false);
      }
    };

    fetchData();
  }, [id]);

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
        originImage: originImage,
        id,
      };

      try {
        const response = await axios.post(`/updateDiscover/${id}`, requestData);
        if (response.data.affectedRows) {
          setRender(RandomNumber());
          toast.success("Güncelleme Başarılı");
        } else {
          toast.error("Güncelleme Başarısız");
          throw new Error("Güncelleme işlemi başarısız oldu.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Bir hata oluştu.");
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
            <label htmlFor="image">Görsel</label>
            <FileInput image={true} fileRef={fileRef} setState={setImage} />
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
