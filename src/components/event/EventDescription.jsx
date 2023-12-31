import Box from "../UI/Box";
import styles from "./EventDescription.module.css";
const EventDescription = ({ children }) => {
	return (
		<Box>
			<pre className={`body-xl ${styles.desc}`}>{children}</pre>
		</Box>
	);
};

export default EventDescription;
