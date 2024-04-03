import styles from "./ContactsPage.module.scss";
import { Component } from "solid-js";

const ContactsPage: Component = () => {
  return (
    <section class={styles.contacts_page}>
      <div class={styles.content}>
        <div>contacts page</div>
      </div>
    </section>
  );
};

export default ContactsPage;
