import { useEffect } from "react";
import Box from "../UI/Box";
import Input from "../UI/Input";
import styles from "./SignupForm.module.css";
const BASE_URL = "https://api-akbarmasoud.iran.liara.run/";


const SignupForm = ({ slug, fields, setFields }) => {
	const accessToken = localStorage.getItem("blueberry-access");
	const inputChangeHandler = (e, index) => {
		const newFields = [...fields];
		newFields[index].answer = e.target.value;
		setFields(newFields);
	};
	useEffect(() => {
		const fetchFormFields = async () => {
			const res = await fetch(
				`${BASE_URL}api/event/registration/${slug}/`,
				{
					method: "GET",
					headers: {
						"content-type": "application",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			const data = await res.json();
			if (res.ok) {
				setFields(data.fields);
			}
		};
		fetchFormFields();
	}, [accessToken, setFields, slug]);

	return (
		<Box className={styles.formBox}>
			{fields.map((field, index) => (
				<div className={styles.inputBox} key={field.filed}>
					<label htmlFor={field.field} className="caption-lg">
						{field.question} <span className={`caption-lg ${styles.essential}`}>(ضروری)</span>
					</label>
					<Input
						id={field.field}
						placeholder={`${field.question} خود را وارد کنید`}
						value={fields.at(index).answer}
						onChange={(e) => inputChangeHandler(e, index)}
					/>
				</div>
			))}
		</Box>
	);
};

export default SignupForm;
