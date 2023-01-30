import styles from "@styles/pages/quotes/Dashboard.module.css";
import Chat from "./chat";
import Conversations from "./conversations";

const QuotesDashboard = () => {
  return (
    <div>
      <h2 className={styles.h2}>Conversations</h2>
      <hr className={styles.hr} />
      <div className={styles.container}>
        <div className={styles.list}>
          <Conversations />
        </div>
        <div className={styles.chat}>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default QuotesDashboard;
