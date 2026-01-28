

import { OptimisticSiteForm } from "./components/OptimisticSiteForm";
import { RealtimeAlarms } from "./components/RealtimeAlarms";
import { SiteList } from "./components/SiteList";

export default function Home() {
  return (
    <main>
      <div className="container">
        <header className="page-header">
          <h1>Frontend Engineer Assessment</h1>
          <p>API integration, real-time updates, and error handling demo.</p>
        </header>
        <SiteList />
        <OptimisticSiteForm />
        <RealtimeAlarms />
      </div>
    </main>
  );
}
