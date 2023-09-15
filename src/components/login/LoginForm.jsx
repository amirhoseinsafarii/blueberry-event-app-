// hooks
import { useState } from "react";

// styles
import styles from "./LoginForm.module.css";

// logo and icons
import mobileIcon from "../../assets/icons/mobile.svg";

// components
import Input from "../UI/Input";
import Button from "../UI/Button";
import ErrorMessage from "../UI/ErrorMessage";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/";

const LoginForm = ({ phoneNumber, setPhoneNumber }) => {
	const [hasError, setHasError] = useState(false);
	const navigate = useNavigate();

	const inputChangeHandler = (e) => {
		setPhoneNumber(e.target.value);
	};

	const submitHander = (e) => {
		e.preventDefault(); // stop page refresh
		setHasError(false);
		const userPhone = {
			phone_number: phoneNumber,
		};

		const checkPhone = async () => {
			try {
				const res = await fetch(
					`${BASE_URL}api/account/account-stat/`,
					{
						method: "POST",
						headers: {
							"content-type": "application/json",
						},
						body: JSON.stringify(userPhone),
					}
				);
				if(!res.ok) throw new Error("")
				const data = await res.json();
				const userHasPassword = data.password;
				userHasPassword ? navigate("./password") : navigate("./otp");
			} catch (er){
				setHasError(true);
			}
		};
		checkPhone();
	};

	return (
		<form className={styles.loginForm} onSubmit={submitHander}>
			<label className="caption-lg" htmlFor="phone-number">
				شماره موبایل
			</label>
			<div className={styles.inputField}>
				<img
					src={mobileIcon}
					className={styles.mobileIcon}
					alt="mobile icon"
				/>
				<Input
					type="text"
					value={phoneNumber}
					onChange={inputChangeHandler}
					placeholder="شماره موبایل خود را وارد کنید"
					id="phone-number"
				/>
				{hasError && (
					<ErrorMessage>شماره وارد شده نامعتبر است</ErrorMessage>
				)}
			</div>

			<Button isSmall={true} type="secondary">
				ورود به حساب کاربری
			</Button>
		</form>
	);
};

export default LoginForm;
