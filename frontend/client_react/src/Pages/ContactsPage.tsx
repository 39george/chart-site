import styles from "./ContactsPage.module.scss";
import { FC } from "react";

const ContactsPage: FC = () => {
  return (
    <section className={styles.contacts_page}>
      <div className={styles.content}>
        <div>contacts page</div>
      </div>
    </section>
  );
};

export default ContactsPage;
