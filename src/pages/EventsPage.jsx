import { useEffect, useState } from "react";
import EventBox from "../components/event/EventBox";
import styles from "./EventsPage.module.css";
import MainHeader from "../components/layout/MainHeader";
import getAccess from "../funcs/getAccess";
import MainFooter from "../components/layout/MainFooter";
import useUrl from "../hooks/useUrl";
import { useNavigate } from "react-router-dom";

const sortEventList = (eventsList) => {
	let sortedEventList = [];
	sortedEventList = sortedEventList.concat(
		eventsList.slice().filter((event) => event.status.status === "REG")
	);
	sortedEventList = sortedEventList.concat(
		eventsList.slice().filter((event) => event.status.status === "TICKET")
	);
	sortedEventList = sortedEventList.concat(
		eventsList
			.slice()
			.filter((event) => event.status.status === "CERTIFICATE")
	);
	sortedEventList = sortedEventList.concat(
		eventsList.slice().filter((event) => event.status.status === "ERROR")
	);
	return sortedEventList;
};

const EventsPage = ({setNextUrl}) => {
	const BASE_URL = useUrl();
	const navigate = useNavigate();
	const [events, setEvents] = useState([]);
	const [token, setToken] = useState(() => {
		return localStorage.getItem("blueberry-access");
	});
	const redirectHandler = (slug) => {
		navigate(`./${slug}`);
	};
	useEffect(() => {
		const fetchEvents = async () => {
			const reqHeader = token
				? {
						"content-type": "application/json",
						Authorization: `Bearer ${token}`,
				}
				: {
						"content-type": "application/json",
				};

			const res = await fetch(BASE_URL + "api/events/", {
				method: "GET",
				headers: reqHeader,
			});
			const data = await res.json();
			if (!res.ok) {
				getAccess(setToken);
			} else {
				setEvents(data);
			}
		};
		fetchEvents();
	}, [token, BASE_URL]);
	const doneEvents = events
		.slice()
		.filter((event) => event.status.status === "END");
	const curEvents = sortEventList(events)
		.slice()
		.filter((event) => event.status.status !== "END");
	console.log(events);

	return (
		<>
			<MainHeader />
			<main className={`container ${styles.container}`}>
				<section className={styles.eventsSection}>
					<h5>رویداد های جدید</h5>
					<div className={styles.events}>
						{curEvents.map((event) => (
							<EventBox
							setNextUrl={setNextUrl}
								onClick={() => redirectHandler(event.slug)}
								event={event}
								key={event.slug}
							/>
						))}
					</div>
				</section>
				<section className={styles.eventsSection}>
					<h5>رویداد های برگزار شده</h5>
					<div className={styles.events}>
						{doneEvents.map((event) => (
							<EventBox event={event} key={event.slug} />
						))}
					</div>
				</section>
			</main>
			<MainFooter />
		</>
	);
};

export default EventsPage;
