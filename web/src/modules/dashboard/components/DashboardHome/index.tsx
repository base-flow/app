import type { FC } from "react";
import LoadingMask from "@/components/LoadingMask";
import styles from "./index.module.scss";

const DashboardHome: FC = () => {
  return (
    <div className={`${styles.DashboardHome} g-page min-wrap`}>
      <LoadingMask show={true} />
    </div>
  );
};

export default DashboardHome;
