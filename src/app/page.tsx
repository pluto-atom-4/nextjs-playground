import TabContainer from "@/components/TabContainer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <TabContainer />
      </main>
    </>
  );
}