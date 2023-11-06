import styles from "./PhoneNumberSection.module.css";
import OTPInput from "react-otp-input";
import Box from "../UI/Box";
import Input from "../UI/Input";
import Button from "../UI/Button";
import ErrorMessage from "../UI/ErrorMessage";
import ConfirmBox from "./ConfirmBox";
import { useState, useCallback, useEffect } from "react";
import useUrl from "../../hooks/useUrl";
import Loader from "../UI/Loader";

const WAITING_TIME = 120;
const OTP_LENGTH = 6;

const PhoneNumberSection = () => {
	const BASE_URL = useUrl();
	const [inputDisable, setInputDisable] = useState(true);
	const [isChangingPhone, setIsChangingPhone] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [otp, setOtp] = useState("");
	const [remainingTime, setRemainingTime] = useState(WAITING_TIME);
	const [showConfirmAlert, setShowConfirmAlert] = useState(false);
	const [newPhoneNumber, setNewPhoneNumber] = useState("");
	const [prevPhoneNumber, setPrevPhoneNumber] = useState("");
	const [hasPhoneError, setHasPhoneError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const accessToken = localStorage.getItem("blueberry-access");

	useEffect(() => {
		const fetchUserPhoneNumber = async () => {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}api/account/phone-number/`, {
				method: "GET",
				headers: {
					"content-type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (res.ok) {
				const data = await res.json();
				const formattedPhoneNumber = "09" + data.Phone_number.slice(4);
				setPrevPhoneNumber(formattedPhoneNumber);
				setNewPhoneNumber(formattedPhoneNumber);
			}
			setIsLoading(false);
		};
		fetchUserPhoneNumber();
	}, [accessToken, BASE_URL, setIsLoading]);

	const sendOtp = useCallback(async () => {
		setIsLoading(true);
		setRemainingTime(WAITING_TIME);
		const res = await fetch(
			`${BASE_URL}api/account/change-phone/${newPhoneNumber}`,
			{
				method: "GET",
				headers: {
					"content-type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		if (!res.ok) {
			const data = await res.json();
			setHasPhoneError(data.error);
		} else {
			setRemainingTime(30);
			setIsChangingPhone(true);
		}
		setIsLoading(false);
	}, [newPhoneNumber, accessToken, BASE_URL]);

	useEffect(() => {
		if (remainingTime === 0) return;
		const timer = setInterval(() => {
			setRemainingTime((curTime) => curTime - 1);
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, [remainingTime]);

	const changePhoneNumberHandler = () => {
		setHasPhoneError(false);
		setOtp("");
		sendOtp();
	};
	const otpChangeHandler = (value) => {
		setOtp(value);
		if (value.length === OTP_LENGTH) {
			const userLoginInfo = {
				phone_number: newPhoneNumber,
				otp: value,
			};
			const validateOtp = async () => {
				setIsLoading(true);
				const res = await fetch(
					`${BASE_URL}api/account/change-phone/`,
					{
						method: "PUT",
						headers: {
							"content-type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
						body: JSON.stringify(userLoginInfo),
					}
				);
				if (!res.ok) {
					setHasError(true);
				} else {
					setPrevPhoneNumber(newPhoneNumber);
					setShowConfirmAlert(true);
					setIsChangingPhone(false);
					setInputDisable(true);
				}
				setIsLoading(false);
			};
			validateOtp();
		}
	};

	const cancelChangePhone = () => {
		setInputDisable(true);
		setIsChangingPhone(false);
		setNewPhoneNumber(prevPhoneNumber);
	};

	return (
		<div className={styles.section}>
			<h5 className={styles.sectionTitle}>شماره موبایل</h5>
			{showConfirmAlert && (
				<ConfirmBox btnHandler={() => setShowConfirmAlert(false)}>
					شماره موبایل با موفقیت به {prevPhoneNumber} تغییر یافت.
				</ConfirmBox>
			)}
			<Box className={styles.box}>
				{isLoading ? (
					<Loader />
				) : isChangingPhone ? (
					<div className={styles.otpForm}>
						<p className="caption-lg">
							کد تائید به شماره {newPhoneNumber} ارسال شد
						</p>
						<p className="caption-lg">
							کد پیامک شده را جهت تائید شماره موبایل وارد کنید
						</p>

						<div className={styles.changePhoneOtp}>
							<OTPInput
								onChange={otpChangeHandler}
								value={otp}
								inputStyle={`body-sm ${styles.input} ${
									hasError && "error"
								}`}
								numInputs={6}
								separator={<span></span>}
								renderInput={(props) => <input {...props} />}
								containerStyle={styles.otpContainer}
								inputType="tel"
							/>
							{hasError && (
								<ErrorMessage className={styles.error}>
									کد وارد شده اشتباه است
								</ErrorMessage>
							)}
							{remainingTime === 0 ? (
								<Button
									onClick={sendOtp}
									isSmall={true}
									type="tertiary"
								>
									ارسال مجدد پیامک
								</Button>
							) : (
								<Button
									isSmall={true}
									type="tertiary"
									className={styles.deactiveBtn}
								>
									ارسال مجدد تا <span> {remainingTime} </span>{" "}
									ثانیه دیگر
								</Button>
							)}
							<Button
								isSmall
								type="outline"
								onClick={cancelChangePhone}
							>
								لغو
							</Button>
						</div>
					</div>
				) : (
					<div className={styles.changePhoneNumber}>
						<div className={styles.inputBox}>
							<label
								className="caption-lg"
								htmlFor="phone-number"
							>
								شماره موبایل
							</label>
							<Input
								onChange={(e) => {
									setHasPhoneError("");
									setNewPhoneNumber(e.target.value);
								}}
								disabled={inputDisable}
								value={newPhoneNumber}
								id="phone-number"
								placeholder="شماره موبایل خود را وارد کنید"
								className={hasPhoneError && "error"}
							/>
							{hasPhoneError && (
								<ErrorMessage>{hasPhoneError}</ErrorMessage>
							)}
						</div>
						{inputDisable ? (
							<Button
								isSmall
								type="primary"
								onClick={() => setInputDisable(false)}
							>
								ویرایش شماره موبایل
							</Button>
						) : (
							<Button
								isSmall
								type="primary"
								onClick={changePhoneNumberHandler}
							>
								ارسال کد تایید
							</Button>
						)}
					</div>
				)}
			</Box>
		</div>
	);
};

export default PhoneNumberSection;
