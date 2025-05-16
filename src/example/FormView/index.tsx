import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object({
  name: yup
    .string()
    .label("名前")
    .required("${label}は必須入力です")
    .max(20, "${label}は${max}文字以内で入力してください。"),
  country: yup.string().label("国籍").required("${label}は必須入力です。"),
  gender: yup.string().label("性別").required("${label}は必須入力です。"),
  email: yup
    .string()
    .label("メールアドレス")
    .required("${label}は必須入力です")
    .email("${label}の形式が不正です。"),
  agree: yup
    .boolean()
    .oneOf([true], "利用規約に同意してください。")
    .label("同意"),
  memo: yup
    .string()
    .label("備考")
    .required("${label}は必須入力です")
    .min(10, "${label}は${min}文字以上で入力してください。"),
})

export const FormView = React.memo(function FormView() {
  const defaultValues = {
    name: "",
    email: "",
    gender: "male",
    country: "japan",
    agree: false,
    memo: "",
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    // Yupに検証を委ねる
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: any) => console.log(data)
  const onError = (errors: any) => console.log(errors)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div>
          <label htmlFor="name">名前：</label>
          <input id="name" type="text" {...register("name")} />
          <div>{errors.name?.message}</div>
        </div>
        <div>
          <label htmlFor="gender">性別：</label>
          <div>
            <label>
              <input type="radio" value="male" {...register("gender")} />
              男性
            </label>
            <label>
              <input type="radio" value="female" {...register("gender")} />
              女性
            </label>
          </div>
          <div>{errors.gender?.message}</div>
        </div>
        <div>
          <label htmlFor="country">国籍：</label>
          <select id="country" {...register("country")}>
            <option value="">選択してください</option>
            <option value="japan">日本</option>
            <option value="usa">アメリカ</option>
            <option value="china">中国</option>
            <option value="other">その他</option>
          </select>
          <div>{errors.country?.message}</div>
        </div>
        <div>
          <label htmlFor="email">メールアドレス：</label>
          <input id="email" type="email" {...register("email")} />
          <div>{errors.email?.message}</div>
        </div>
        <div>
          <label htmlFor="agree">
            <input id="agree" type="checkbox" {...register("agree")} />
            利用規約に同意する
          </label>
          <div>{errors.agree?.message}</div>
        </div>
        <div>
          <label htmlFor="memo">備考：</label>
          <textarea id="memo" {...register("memo")} />
          <div>{errors.memo?.message}</div>
        </div>
        <div>
          <button type="submit">送信</button>
        </div>
      </form>
    </div>
  )
})
