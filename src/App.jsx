import './App.css'
import { useEffect, useState } from 'react'
import { supabase, supabaseError } from './lib/supabase'
import {
  Compass,
  Heart,
  Home,
  Map,
  MessageCircle,
  User,
  Plus,
  ArrowUpRight,
  Sparkles,
  MapPin,
  ChevronRight,
  Search,
  Check,
  Bookmark,
  X,
} from 'lucide-react'

const routes = [
  {
    id: 1,
    title: 'Рим за пять дней',
    country: 'Италия',
    duration: '5 дней',
    description:
      'Колизей на рассвете, маленькие траттории и вечерние прогулки по Трастевере.',
    tag: 'Классика',
  },
  {
    id: 2,
    title: 'Атлантический горизонт',
    country: 'Португалия',
    duration: '7 дней',
    description:
      'Лиссабон, океан, маленькие города и дорога вдоль Атлантики.',
    tag: 'Океан',
  },
  {
    id: 3,
    title: 'Осенний Париж',
    country: 'Франция',
    duration: '4 дня',
    description:
      'Кофейни, музеи, тихие улицы и прогулки вдоль Сены.',
    tag: 'Город',
  },
]

const places = [
  {
    id: 1,
    name: 'Колизей',
    city: 'Рим',
    country: 'Италия',
    category: 'Достопримечательности',
    categoryShort: 'История',
    icon: '🏛️',
    description:
      'Одна из главных достопримечательностей Рима и место, с которого удобно начать знакомство с городом.',
    route: 'Рим за пять дней',
  },
  {
    id: 2,
    name: 'Эйфелева башня',
    city: 'Париж',
    country: 'Франция',
    category: 'Достопримечательности',
    categoryShort: 'Город',
    icon: '🗼',
    description:
      'Символ Парижа и отличная точка, чтобы увидеть город с высоты.',
    route: 'Осенний Париж',
  },
  {
    id: 3,
    name: 'Монмартр',
    city: 'Париж',
    country: 'Франция',
    category: 'Прогулки',
    categoryShort: 'Прогулка',
    icon: '🎨',
    description:
      'Атмосферный район с узкими улицами, площадями и красивыми видами на Париж.',
    route: 'Осенний Париж',
  },
  {
    id: 4,
    name: 'Трастевере',
    city: 'Рим',
    country: 'Италия',
    category: 'Прогулки',
    categoryShort: 'Район',
    icon: '🍝',
    description:
      'Живописный район Рима для вечерних прогулок, небольших ресторанов и спокойной атмосферы.',
    route: 'Рим за пять дней',
  },
  {
    id: 5,
    name: 'Белем',
    city: 'Лиссабон',
    country: 'Португалия',
    category: 'Достопримечательности',
    categoryShort: 'История',
    icon: '⛵',
    description:
      'Исторический район Лиссабона рядом с рекой Тежу и океанским горизонтом.',
    route: 'Атлантический горизонт',
  },
  {
    id: 6,
    name: 'Синтра',
    city: 'Синтра',
    country: 'Португалия',
    category: 'Природа',
    categoryShort: 'Природа',
    icon: '🌿',
    description:
      'Зелёные холмы, дворцы и прогулки среди природы недалеко от Лиссабона.',
    route: 'Атлантический горизонт',
  },
  {
    id: 7,
    name: 'Люксембургский сад',
    city: 'Париж',
    country: 'Франция',
    category: 'Природа',
    categoryShort: 'Парк',
    icon: '🌳',
    description:
      'Большой парижский сад для спокойной прогулки в центре города.',
    route: 'Осенний Париж',
  },
  {
    id: 8,
    name: 'Набережная Тежу',
    city: 'Лиссабон',
    country: 'Португалия',
    category: 'Прогулки',
    categoryShort: 'Океан',
    icon: '🌊',
    description:
      'Пространство у воды для прогулки и первого знакомства с атлантическим Лиссабоном.',
    route: 'Атлантический горизонт',
  },
]

const navigation = [
  { id: 'routes', label: 'Маршруты', icon: Map },
  { id: 'ai', label: 'AI', icon: MessageCircle },
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'favorites', label: 'Избранное', icon: Heart },
  { id: 'profile', label: 'Профиль', icon: User },
]

const categories = [
  'Все',
  'Достопримечательности',
  'Прогулки',
  'Природа',
]

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [favorites, setFavorites] = useState([])
  const [placesTab, setPlacesTab] = useState('all')
  const [savedPlaces, setSavedPlaces] = useState([])
  const [visitedPlaces, setVisitedPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('gorizont-saved-places')
    const visited = localStorage.getItem('gorizont-visited-places')

    if (saved) {
      setSavedPlaces(JSON.parse(saved))
    }

    if (visited) {
      setVisitedPlaces(JSON.parse(visited))
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        setAuthLoading(false)
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'gorizont-saved-places',
      JSON.stringify(savedPlaces),
    )
  }, [savedPlaces])

  useEffect(() => {
    localStorage.setItem(
      'gorizont-visited-places',
      JSON.stringify(visitedPlaces),
    )
  }, [visitedPlaces])

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const toggleSavedPlace = (id) => {
    setSavedPlaces((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const toggleVisitedPlace = (id) => {
    setVisitedPlaces((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-logo">
          ГОРИЗОНТ
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <AuthScreen />
    )
  }

  return (
    <div className="app-shell">
      <main className="app-content">
        {activeTab === 'home' && (
          <HomeScreen
            session={session}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onNavigate={setActiveTab}
            onOpenPlaces={() => {
              setActiveTab('places')
              setPlacesTab('all')
              setSelectedPlace(null)
            }}
            onOpenPlace={(place) => {
              setSelectedPlace(place)
            }}
          />
        )}

        {activeTab === 'routes' && (
          <RoutesScreen
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenPlaces={() => {
              setActiveTab('places')
              setPlacesTab('all')
            }}
          />
        )}

        {activeTab === 'ai' && <AIScreen />}

        {activeTab === 'favorites' && (
          <FavoritesScreen
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            savedPlaces={savedPlaces}
            visitedPlaces={visitedPlaces}
            session={session}
            onOpenPlaces={() => setActiveTab('places')}
          />
        )}

        {activeTab === 'places' && (
          <PlacesScreen
            placesTab={placesTab}
            setPlacesTab={setPlacesTab}
            savedPlaces={savedPlaces}
            visitedPlaces={visitedPlaces}
            onToggleSaved={toggleSavedPlace}
            onToggleVisited={toggleVisitedPlace}
            onOpenPlace={setSelectedPlace}
          />
        )}
      </main>

      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          saved={savedPlaces.includes(selectedPlace.id)}
          visited={visitedPlaces.includes(selectedPlace.id)}
          onToggleSaved={toggleSavedPlace}
          onToggleVisited={toggleVisitedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      <Navigation
        activeTab={activeTab}
        onChange={setActiveTab}
      />
    </div>
  )
}

function HomeScreen({
  session,
  favorites,
  onToggleFavorite,
  onNavigate,
  onOpenPlaces,
  onOpenPlace,
}) {
  const userName =
    session?.user?.user_metadata?.name || 'Путешественник'
  return (
    <div className="page home-page">
      <header className="page-header home-header">
        <div>
          <span className="eyebrow">ТВОЙ ГОРИЗОНТ</span>

          <h1>
            Привет,
            <br />
            {userName}
          </h1>

          <p>
            Куда отправимся
            <br />
            на этот раз?
          </p>
        </div>

        <div className="home-compass">
          <Compass size={30} strokeWidth={1.4} />
        </div>
      </header>

      <section className="hero-card">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />

        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">
            ИДЕЯ ДЛЯ ПУТЕШЕСТВИЯ
          </span>

          <h2>
            Иногда достаточно
            <br />
            просто выбрать
            <br />
            направление.
          </h2>

          <button
            className="primary-button hero-button"
            onClick={() => onNavigate('ai')}
          >
            <Sparkles size={17} />
            Спросить AI
          </button>
        </div>

        <div className="hero-location">
          <MapPin size={15} />
          <span>куда угодно</span>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ВЫБОР ГОРИЗОНТА</span>
            <h2>Маршруты</h2>
          </div>

          <button
            className="text-button"
            onClick={() => onNavigate('routes')}
          >
            Все
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="route-grid">
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              favorite={favorites.includes(route.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      <section className="places-preview">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ИССЛЕДУЙ</span>
            <h2>Места</h2>
          </div>

          <button
            className="text-button"
            onClick={onOpenPlaces}
          >
            Все места
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="places-mini-grid">
          {places.slice(0, 3).map((place) => (
            <button
              className="place-mini-card"
              key={place.id}
              onClick={() => onOpenPlace(place)}
            >
              <span className="place-mini-icon">
                {place.icon}
              </span>

              <span>
                <strong>{place.name}</strong>
                <small>
                  {place.city} · {place.country}
                </small>
              </span>

              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function RoutesScreen({
  favorites,
  onToggleFavorite,
  onOpenPlaces,
}) {
  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">ТВОИ НАПРАВЛЕНИЯ</span>

        <h1>Маршруты</h1>

        <p>
          Собирай места, идеи и путешествия
          в одной коллекции.
        </p>
      </header>

      <div className="routes-toolbar">
        <span>{routes.length} маршрута</span>

        <button
          className="filter-button"
          onClick={onOpenPlaces}
        >
          Смотреть места
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="route-grid route-grid-large">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            favorite={favorites.includes(route.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      <button className="create-route-card">
        <div className="create-route-icon">
          <Plus size={22} />
        </div>

        <div className="create-route-text">
          <span className="eyebrow">ТВОЯ ИСТОРИЯ</span>

          <h3>Создать свой маршрут</h3>

          <p>
            Собери места, которые хочешь
            увидеть, в одну поездку.
          </p>
        </div>

        <ArrowUpRight
          className="create-route-arrow"
          size={20}
        />
      </button>
    </div>
  )
}

function RouteCard({
  route,
  favorite,
  onToggleFavorite,
}) {
  return (
    <article className="route-card">
      <div className="route-card-visual">
        <div className="route-card-gradient" />

        <span className="route-tag">
          {route.tag}
        </span>

        <button
          className={`favorite-button ${
            favorite ? 'is-active' : ''
          }`}
          onClick={() => onToggleFavorite(route.id)}
          aria-label={
            favorite
              ? 'Убрать из избранного'
              : 'Добавить в избранное'
          }
        >
          <Heart
            size={18}
            fill={favorite ? 'currentColor' : 'none'}
          />
        </button>

        <span className="route-number">
          0{route.id}
        </span>
      </div>

      <div className="route-card-body">
        <div className="route-card-country">
          <span>{route.country}</span>
          <span>·</span>
          <span>{route.duration}</span>
        </div>

        <h3>{route.title}</h3>

        <p>{route.description}</p>

        <div className="route-card-footer">
          <span>Открыть маршрут</span>
          <ArrowUpRight size={16} />
        </div>
      </div>
    </article>
  )
}

function PlacesScreen({
  placesTab,
  setPlacesTab,
  savedPlaces,
  visitedPlaces,
  onToggleSaved,
  onToggleVisited,
  onOpenPlace,
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')

  let visiblePlaces = places

  if (placesTab === 'saved') {
    visiblePlaces = visiblePlaces.filter((place) =>
      savedPlaces.includes(place.id),
    )
  }

  if (placesTab === 'visited') {
    visiblePlaces = visiblePlaces.filter((place) =>
      visitedPlaces.includes(place.id),
    )
  }

  visiblePlaces = visiblePlaces.filter((place) => {
    const matchesCategory =
      category === 'Все' ||
      place.category === category

    const query = search.toLowerCase().trim()

    const matchesSearch =
      !query ||
      place.name.toLowerCase().includes(query) ||
      place.city.toLowerCase().includes(query) ||
      place.country.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="page places-page">
      <header className="page-header">
        <span className="eyebrow">ТВОЯ КАРТА МИРА</span>

        <h1>Места</h1>

        <p>
          Сохраняй места, которые хочется
          увидеть, и отмечай уже посещённые.
        </p>
      </header>

      <div className="places-tabs">
        <button
          className={placesTab === 'all' ? 'is-active' : ''}
          onClick={() => setPlacesTab('all')}
        >
          Все
        </button>

        <button
          className={
            placesTab === 'saved' ? 'is-active' : ''
          }
          onClick={() => setPlacesTab('saved')}
        >
          Хочу посетить
          <span>{savedPlaces.length}</span>
        </button>

        <button
          className={
            placesTab === 'visited' ? 'is-active' : ''
          }
          onClick={() => setPlacesTab('visited')}
        >
          Посетил
          <span>{visitedPlaces.length}</span>
        </button>
      </div>

      <div className="places-search">
        <Search size={18} />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Найти место или город..."
        />

        {search && (
          <button onClick={() => setSearch('')}>
            <X size={17} />
          </button>
        )}
      </div>

      <div className="category-scroll">
        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item ? 'is-active' : ''
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {visiblePlaces.length === 0 ? (
        <div className="empty-state places-empty">
          <div className="empty-icon">
            <MapPin size={25} />
          </div>

          <span className="eyebrow">
            ПОКА ПУСТО
          </span>

          <h3>
            Здесь появятся
            <br />
            твои места.
          </h3>

          <p>
            Попробуй изменить поиск или
            сохранить новое место.
          </p>
        </div>
      ) : (
        <div className="places-grid">
          {visiblePlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              saved={savedPlaces.includes(place.id)}
              visited={visitedPlaces.includes(place.id)}
              onToggleSaved={onToggleSaved}
              onToggleVisited={onToggleVisited}
              onOpen={onOpenPlace}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PlaceCard({
  place,
  saved,
  visited,
  onToggleSaved,
  onToggleVisited,
  onOpen,
}) {
  return (
    <article className="place-card">
      <button
        className="place-card-main"
        onClick={() => onOpen(place)}
      >
        <div className="place-visual">
          <span>{place.icon}</span>

          <small>{place.categoryShort}</small>
        </div>

        <div className="place-card-body">
          <div className="place-location">
            <MapPin size={13} />
            {place.city}, {place.country}
          </div>

          <h3>{place.name}</h3>

          <p>{place.description}</p>

          <span className="place-route">
            {place.route}
          </span>
        </div>
      </button>

      <div className="place-actions">
        <button
          className={`place-action ${
            saved ? 'is-active' : ''
          }`}
          onClick={() => onToggleSaved(place.id)}
        >
          <Bookmark
            size={16}
            fill={saved ? 'currentColor' : 'none'}
          />

          {saved
            ? 'В списке'
            : 'Хочу посетить'}
        </button>

        <button
          className={`place-action ${
            visited ? 'is-visited' : ''
          }`}
          onClick={() => onToggleVisited(place.id)}
        >
          <Check size={16} />
          {visited ? 'Посещено' : 'Посетил'}
        </button>
      </div>
    </article>
  )
}

function PlaceModal({
  place,
  saved,
  visited,
  onToggleSaved,
  onToggleVisited,
  onClose,
}) {
  return (
    <div
      className="place-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="place-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
        >
          <X size={19} />
        </button>

        <div className="modal-place-icon">
          {place.icon}
        </div>

        <span className="eyebrow">
          {place.categoryShort}
        </span>

        <h2>{place.name}</h2>

        <div className="modal-location">
          <MapPin size={15} />
          {place.city}, {place.country}
        </div>

        <p>{place.description}</p>

        <div className="modal-route">
          <span className="eyebrow">В МАРШРУТЕ</span>
          <strong>{place.route}</strong>
        </div>

        <div className="modal-actions">
          <button
            className={`primary-button ${
              visited ? 'modal-visited' : ''
            }`}
            onClick={() => onToggleVisited(place.id)}
          >
            <Check size={17} />
            {visited ? 'Уже посещено' : 'Я посетил'}
          </button>

          <button
            className={`secondary-button ${
              saved ? 'is-active' : ''
            }`}
            onClick={() => onToggleSaved(place.id)}
          >
            <Bookmark
              size={17}
              fill={saved ? 'currentColor' : 'none'}
            />
            {saved
              ? 'Сохранено'
              : 'Хочу посетить'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AIScreen() {
  return (
    <div className="page ai-page">
      <header className="page-header">
        <span className="eyebrow">
          ТВОЙ ПУТЕШЕСТВЕННИК
        </span>

        <h1>
          Горизонт
          <br />
          <span>AI</span>
        </h1>

        <p>
          Расскажи о поездке мечты —
          <br />
          начнём собирать её вместе.
        </p>
      </header>

      <div className="ai-intro-card">
        <div className="ai-symbol">
          <Sparkles size={28} />
        </div>

        <div>
          <span className="eyebrow">
            УМНЫЙ ПОМОЩНИК
          </span>

          <h2>
            Здесь появится твой
            персональный план путешествия.
          </h2>

          <p>
            AI поможет подобрать направление,
            маршрут, места и идеи для поездки.
          </p>
        </div>
      </div>

      <div className="ai-prompts">
        <button>
          <span>Хочу море и маленькие города</span>
          <ArrowUpRight size={16} />
        </button>

        <button>
          <span>Куда поехать на 4 дня?</span>
          <ArrowUpRight size={16} />
        </button>

        <button>
          <span>Собери необычный маршрут</span>
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  )
}

function FavoritesScreen({
  favorites,
  onToggleFavorite,
}) {
  const favoriteRoutes = routes.filter((route) =>
    favorites.includes(route.id),
  )

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">ТВОЯ КОЛЛЕКЦИЯ</span>

        <h1>Избранное</h1>

        <p>
          Всё, что однажды захотелось
          сохранить для будущего путешествия.
        </p>
      </header>

      {favoriteRoutes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Heart size={25} />
          </div>

          <span className="eyebrow">ПОКА ПУСТО</span>

          <h3>
            Здесь будет
            <br />
            твой список желаний.
          </h3>

          <p>
            Нажми на сердечко у маршрута,
            который хочется сохранить.
          </p>
        </div>
      ) : (
        <div className="route-grid">
          {favoriteRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              favorite
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileScreen({
  savedPlaces,
  visitedPlaces,
  session,
  onOpenAuth,
  onOpenPlaces,
}) {
  const trips = visitedPlaces.length

  let rank = 'Начинающий'
  let nextRank = 'Путешественник'
  let nextLimit = 2
  let previousLimit = 0

  if (trips >= 20) {
    rank = 'Покоритель горизонтов'
    nextRank = null
    nextLimit = 20
    previousLimit = 20
  } else if (trips >= 10) {
    rank = 'Открыватель'
    nextRank = 'Покоритель горизонтов'
    nextLimit = 20
    previousLimit = 10
  } else if (trips >= 5) {
    rank = 'Исследователь'
    nextRank = 'Открыватель'
    nextLimit = 10
    previousLimit = 5
  } else if (trips >= 2) {
    rank = 'Путешественник'
    nextRank = 'Исследователь'
    nextLimit = 5
    previousLimit = 2
  }

  const progress =
    trips >= 20
      ? 100
      : Math.min(
          100,
          ((trips - previousLimit) /
            (nextLimit - previousLimit)) *
            100,
        )

  const tripsToNext =
    nextRank ? Math.max(0, nextLimit - trips) : 0

  return (
    <div className="page profile-page">
      <header className="page-header">
        <span className="eyebrow">ТВОЙ ПРОФИЛЬ</span>

        <h1>{session?.user?.user_metadata?.name || 'Твой профиль'}</h1>

        <p>{trips} поездок уже за плечами.</p>
      </header>

      <section className="profile-main-card">
        <div className="profile-avatar">
          {(session?.user?.user_metadata?.name || 'П').charAt(0).toUpperCase()}
	</div>

        <div className="profile-main-info">
          <span className="eyebrow">ТВОЙ РАНГ</span>

          <h2>{rank}</h2>

          <p>
            {trips === 0
	      ? 'Твоё путешествие только начинается.'
	      : `Ты уже открыла ${trips} новых горизонтов.`}
          </p>

          <div className="profile-progress">
            <div className="profile-progress-top">
              <span>{trips} поездок</span>
              <span>{nextRank ? nextLimit : '∞'}</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="profile-next">
              {nextRank
  	        ? `Ещё ${tripsToNext} поездок до «${nextRank}»`
  		: 'Ты достигла максимального ранга'}
            </span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="eyebrow">ПОЕЗДКИ</span>
          <strong>{trips}</strong>
        </div>

        <div className="stat-card">
          <span className="eyebrow">ХОЧУ ПОСЕТИТЬ</span>
          <strong>{savedPlaces.length}</strong>
        </div>

        <div className="stat-card">
          <span className="eyebrow">ПОСЕЩЕНО</span>
          <strong>{visitedPlaces.length}</strong>
        </div>
      </section>

      <button
        className="profile-places-card"
        onClick={onOpenPlaces}
      >
        <div className="profile-places-icon">
          <MapPin size={23} />
        </div>

        <div>
          <span className="eyebrow">МОЯ КАРТА</span>
          <h3>Места и воспоминания</h3>
          <p>
            {savedPlaces.length} в списке ·{' '}
            {visitedPlaces.length} посещено
          </p>
        </div>

        <ArrowUpRight size={20} />
      </button>

      <div className="rank-list">
        <div className="rank-list-header">
          <div>
            <span className="eyebrow">
              ПУТЬ ПУТЕШЕСТВЕННИКА
            </span>

            <h2>Твои горизонты</h2>
          </div>
        </div>

        <RankRow
  	  icon="🌱"
  	  title="Начинающий"
  	  range="0–1 поездка"
  	  done={trips >= 2}
  	  current={rank === 'Начинающий'}
	/>

	<RankRow
  	  icon="🧭"
  	  title="Путешественник"
  	  range="2–4 поездки"
	  done={trips >= 5}
	  current={rank === 'Путешественник'}
	/>

	<RankRow
	  icon="🗺️"
	  title="Исследователь"
	  range="5–9 поездок"
	  done={trips >= 10}
	  current={rank === 'Исследователь'}
	/>

	<RankRow
	  icon="🌅"
	  title="Открыватель"
	  range="10–19 поездок"
	  done={trips >= 20}
	  current={rank === 'Открыватель'}
	/>

	<RankRow
	  icon="✨"
	  title="Покоритель горизонтов"
	  range="20+ поездок"
	  current={rank === 'Покоритель горизонтов'}
	/>
      </div>
    </div>
  )
}

function RankRow({
  icon,
  title,
  range,
  done,
  current,
}) {
  return (
    <div
      className={`rank-row ${
        current ? 'is-current' : ''
      }`}
    >
      <div className="rank-icon">{icon}</div>

      <div className="rank-row-info">
        <strong>{title}</strong>
        <span>{range}</span>
      </div>

      {done && (
        <span className="rank-status">✓</span>
      )}

      {current && (
        <span className="rank-current">Сейчас</span>
      )}
    </div>
  )
}

function Navigation({
  activeTab,
  onChange,
}) {
  return (
    <nav className="bottom-navigation">
      <div className="bottom-navigation-inner">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = activeTab === item.id

          return (
            <button
              key={item.id}
              className={`nav-item ${
                active ? 'is-active' : ''
              } ${
                item.id === 'home'
                  ? 'nav-home'
                  : ''
              }`}
              onClick={() => onChange(item.id)}
            >
              <span className="nav-icon">
                <Icon
                  size={item.id === 'home' ? 22 : 19}
                  strokeWidth={active ? 2 : 1.5}
                />
              </span>

              <span className="nav-label">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
function AuthScreen() {
  const [mode, setMode] = useState('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!email.trim() || !password.trim()) {
      setError('Заполни email и пароль.')
      return
    }

    if (mode === 'register' && !name.trim()) {
      setError('Напиши своё имя.')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.')
      return
    }

    if (!supabase) {
      setError(
        supabaseError ||
          'Не удалось подключиться к сервису авторизации.',
      )
      return
    }

    setLoading(true)

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        })

        if (error) {
          setError(error.message)
          return
        }

        if (data.session) {
          return
        }

        setSuccess(
          'Аккаунт создан. Проверь почту и подтверди email, чтобы войти.',
        )

        return
      }

      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (error) {
        setError(
          'Не удалось войти. Проверь email и пароль.',
        )
        return
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error)
      setError(
        'Не удалось выполнить авторизацию. Попробуй ещё раз.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <span className="eyebrow">ГОРИЗОНТ</span>

        <h1>
          {mode === 'register'
            ? 'Создай свой'
            : 'С возвращением'}
          <br />
          <span>горизонт</span>
        </h1>

        <p className="auth-description">
          {mode === 'register'
            ? 'Сохраняй места, маршруты и свои путешествия в одном профиле.'
            : 'Войди в свой профиль и продолжи путешествие.'}
        </p>

        <div className="auth-switch">
          <button
            type="button"
            className={
              mode === 'register' ? 'is-active' : ''
            }
            onClick={() => {
              setMode('register')
              setError('')
              setSuccess('')
            }}
          >
            Создать аккаунт
          </button>

          <button
            type="button"
            className={
              mode === 'login' ? 'is-active' : ''
            }
            onClick={() => {
              setMode('login')
              setError('')
              setSuccess('')
            }}
          >
            Войти
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Имя
              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Как тебя зовут?"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Минимум 6 символов"
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {success && (
            <p className="auth-success">
              {success}
            </p>
          )}

          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? mode === 'register'
                ? 'Создаём аккаунт...'
                : 'Входим...'
              : mode === 'register'
                ? 'Создать аккаунт'
                : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}