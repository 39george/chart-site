import styles from "./ContactsPage.module.scss";
import { FC } from "react";

const ContactsPage: FC = () => {
  return (
    <section className={styles.contacts_page}>
      <div className={styles.content}>
        <p className={styles.contacts}>
          Телеграмм для связи{" "}
          <a
            href="https://t.me/nai_alyona"
            target="_blank"
            className={styles.telegramm_link}
          >
            @Alyonaaas
          </a>
        </p>
      </div>
    </section>
  );
};

export default ContactsPage;
