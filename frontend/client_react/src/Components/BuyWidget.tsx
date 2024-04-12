import { format_price } from "../helpers";
import styles from "./BuyWidget.module.scss";
import { FC } from "react";

interface BuyWidgetProps {
  price: string;
}

const BuyWidget: FC<BuyWidgetProps> = ({ price }) => {
  return (
    <div className={styles.buy_widget}>
      <p className={styles.buy_widget_price}>{format_price(price)}₽</p>
      <div className={styles.buy_button_container}>
        <a
          href="https://t.me/alyonaaas"
          target="_blank"
          className={styles.buy_button}
        >
          Купить
        </a>
      </div>
      <div className={styles.buy_widget_top_left}></div>
    </div>
  );
};

export default BuyWidget;
