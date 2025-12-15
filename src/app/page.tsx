import TabContainer from "@/components/TabContainer";
import ThemeSelector from "@/components/ThemeSelector";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <ThemeSelector />
      <main className={styles.main}>
        <TabContainer />
      </main>
    </>
  );
}