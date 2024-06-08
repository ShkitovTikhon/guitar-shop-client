import { useStore } from 'effector-react'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { $guitarPart } from '@/context/guitarPart'
import { $mode } from '@/context/mode'
import PartImagesList from '@/components/modules/PartPage/PartImagesList'
import { formatPrice } from '@/utils/common'
import { $shoppingCart } from '@/context/shopping-cart'
import CartHoverCheckedSvg from '@/components/elements/CartHoverCheckedSvg/CartHoverCheckedSvg'
import CartHoverSvg from '@/components/elements/CartHoverSvg/CartHoverSvg'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import { toggleCartItem } from '@/utils/shopping-cart'
import { $user } from '@/context/user'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PartTabs from '@/components/modules/PartPage/PartTabs'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { getGuitarPartsFx } from '@/app/api/guitarParts'
import {
  $guitarParts,
  setGuitarParts,
  setGuitarPartsByPopularity,
} from '@/context/guitarParts'
import PartAccordion from '@/components/modules/PartPage/PartAccordion'
import { removeFromCartFx } from '@/app/api/shopping-cart'
import styles from '@/styles/part/index.module.scss'

const PartPage = () => {
  const mode = useStore($mode)
  const user = useStore($user)
  const isMobile = useMediaQuery(850)
  const guitarPart = useStore($guitarPart)
  const guitarParts = useStore($guitarParts)
  const cartItems = useStore($shoppingCart)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isInCart = cartItems.some((item) => item.partId === guitarPart.id)
  const spinnerToggleCart = useStore(removeFromCartFx.pending)
  const spinnerSlider = useStore(getGuitarPartsFx.pending)

  useEffect(() => {
    loadGuitarPart()
  }, [])

  const loadGuitarPart = async () => {
    try {
      const data = await getGuitarPartsFx('/guitar-parts?limit=20&offset=0')

      setGuitarParts(data)
      setGuitarPartsByPopularity()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const toggleToCart = () =>
    toggleCartItem(user.username, guitarPart.id, isInCart)

  return (
    <section>
      <div className="container">
        <div className={`${styles.part__top} ${darkModeClass}`}>
          <h2 className={`${styles.part__title} ${darkModeClass}`}>
            {guitarPart.name}
          </h2>
          <div className={styles.part__inner}>
            <PartImagesList />
            <div className={styles.part__info}>
              <span className={`${styles.part__info__price} ${darkModeClass}`}>
                {formatPrice(guitarPart.price || 0)} P
              </span>
              <span className={styles.part__info__stock}>
                {guitarPart.in_stock > 0 ? (
                  <span className={styles.part__info__stock__success}>
                    Есть на складе
                  </span>
                ) : (
                  <span className={styles.part__info__stock__not}>
                    Нет на складе
                  </span>
                )}
              </span>
              <span className={styles.part__info__code}>
                Артикул: {guitarPart.vendor_code}
              </span>
              <button
                className={`${styles.part__info__btn} ${
                  isInCart ? styles.in_cart : ''
                }`}
                onClick={toggleToCart}
              >
                {spinnerToggleCart ? (
                  <span
                    className={spinnerStyles.spinner}
                    style={{ top: 10, left: '45%' }}
                  />
                ) : (
                  <>
                    <span className={styles.part__info__btn__icon}>
                      {isInCart ? <CartHoverCheckedSvg /> : <CartHoverSvg />}
                    </span>
                    {isInCart ? (
                      <span>Добавлено в карзину</span>
                    ) : (
                      <span>Положить в корзину</span>
                    )}
                  </>
                )}
              </button>
              {!isMobile && <PartTabs />}
            </div>
          </div>
        </div>
        {isMobile && (
          <div className={styles.part__accordion}>
            <div className={styles.part__accordion__inner}>
              <PartAccordion title="Описание">
                <div
                  className={`${styles.part__accordion__content} ${darkModeClass}`}
                >
                  <h3
                    className={`${styles.part__tabs__content__title} ${darkModeClass}`}
                  >
                    {guitarPart.name}
                  </h3>
                  <p
                    className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                  >
                    {guitarPart.description}
                  </p>
                </div>
              </PartAccordion>
            </div>
            <PartAccordion title="Характеристики">
              <div
                className={`${styles.part__accordion__content} ${darkModeClass}`}
              >
                <p
                  className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                >
                  {guitarPart.compatibility}
                </p>
              </div>
            </PartAccordion>
          </div>
        )}
        <div className={styles.part__bottom}>
          <h2 className={`${styles.part__title} ${darkModeClass}`}>
            Вам понравится
          </h2>
          <DashboardSlider
            goToPartPage
            spinner={spinnerSlider}
            items={guitarParts.rows || []}
          />
        </div>
      </div>
    </section>
  )
}

export default PartPage
