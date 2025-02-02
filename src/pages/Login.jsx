import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";

export default function Login() {
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const { setLoad, setUser, setLogin } = useContext(UserContext);

  const initialValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    setLoad(false);
  }, [setLoad]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setPending(true);

    try {
      const response = await axios.post("/login", values, {
        withCredentials: true, // Kimlik bilgilerini gönder
      });
      setPending(false);

      if (response.data.error) {
        Swal.fire("Error", `${response.data.error}`, "error");
      } else {
        Swal.fire({
          icon: "success",
          title: "Başarılı",
          text: "Giriş başarılı",
        });
        setUser({
          email: response.data.user.email,
          username: response.data.user.name,
        });
        Cookies.set("token", response.data.token);
        setLogin(true);
        navigate("/");
      }
    } catch (error) {
      setPending(false);
      Swal.fire({
        title: "HATA",
        text: "Bir hata oluştu",
        icon: "error",
        confirmButtonText: "Yeniden Dene",
      });
    }

    setSubmitting(false);
  };

  // .email("Geçerli bir e-posta adresi giriniz")
  const validationSchema = Yup.object({
    email: Yup.string()

      .required("E-posta zorunludur"),
    password: Yup.string().required("Şifre zorunludur"),
  });

  useEffect(() => {
    // Create the grid dynamically when the component mounts
    const para = document.createElement("div");
    para.className =
      "flex flex-wrap gap-0.5 h-screen items-center justify-center relative";

    let el =
      '<div class="transition-colors duration-[1.5s] hover:duration-[0s] border-[#c40471] h-[calc(5vw-2px)] w-[calc(5vw-2px)] md:h-[calc(4vw-2px)] md:w-[calc(4vw-2px)] lg:h-[calc(3vw-4px)] lg:w-[calc(3vw-4px)] bg-gray-900 hover:bg-[#c40471]"></div>';

    for (let k = 1; k <= 1000; k++) {
      el +=
        '<div class="transition-colors duration-[1.5s] hover:duration-[0s] border-[#c40471] h-[calc(5vw-2px)] w-[calc(5vw-2px)] md:h-[calc(4vw-2px)] md:w-[calc(4vw-2px)] lg:h-[calc(3vw-4px)] lg:w-[calc(3vw-4px)] bg-gray-900 hover:bg-[#c40471]"></div>';
    }

    para.innerHTML = el;
    document.getElementById("myDIV").appendChild(para);


    // Cleanup on component unmount
    return () => {
      const element = document.getElementById("myDIV");
      if (element) {
        element.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#c40471] before:to-gray-900 before:absolute">
      <div id="myDIV">
        <div className="w-[100vw] h-[100vh] px-3 sm:px-5 flex items-center justify-center absolute" >
          <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4 rounded-lg" style={{ maxWidth: "420px" }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="w-full flex justify-center text mb:2 md:mb-5">
                    <h1>Yönetim Paneli</h1>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-xs font-medium text-white"
                    >
                      Email
                    </label>
                    <Field
                      // type="email"
                      id="email"
                      name="email"
                      placeholder=""
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-xs font-medium text-white"
                    >
                      Şifre
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder="**********"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || pending}
                    className="mt-4 md:mt-10 w-full flex justify-center text-sm md:text-xl bg py-2 rounded-md"
                  >
                    {pending ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
