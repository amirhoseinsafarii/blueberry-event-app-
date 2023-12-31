import { createContext } from "react";

const UrlContext = createContext();
const UrlProvider = ({ children }) => {
	return (
		<UrlContext.Provider value={"https://api-akbarmasoud.iran.liara.run/"}>
			{children}
		</UrlContext.Provider>
	);
};

export { UrlProvider, UrlContext };
