import styles from "./ContactsPage.module.scss";
import { FC } from "react";

const ContactsPage: FC = () => {
  return (
    <section className={styles.contacts_page}>
      <div className={styles.content}>
        <p className={styles.contacts}>
          <span>Телеграмм для связи</span>
          <a
            href="https://t.me/alyonaaas"
            target="_blank"
            className={styles.telegramm_link}
          >
            @alyonaaas
          </a>
        </p>
      </div>
    </section>
  );
};

export default ContactsPage;
