import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PostHogProvider } from "posthog-js/react";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<PostHogProvider
				apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
				options={{
					api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
					defaults: "2025-05-24",
					capture_exceptions: true,
					debug: import.meta.env.MODE === "development",
				}}
			>
				<App />
			</PostHogProvider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
