import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import questPlayLogo from './LOGO.png'
import './App.css'
import quizzses from './quizzses'

const QuizPage = lazy(() => import('./QuizPage'))

function normalizeAssetPath(image) {
    if (!image) return '/LOGO.png'
    if (image.startsWith('http://') || image.startsWith('https://')) return image
    if (image.startsWith('/')) return image
    return `/${image}`
}

function setMetaTag(attribute, value, content) {
    let tag = document.head.querySelector(`meta[${attribute}="${value}"]`)

    if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, value)
        document.head.appendChild(tag)
    }

    tag.setAttribute('content', content)
}

function Seo({ title, description, image }) {
    useEffect(() => {
        const url = window.location.href
        const canonical = document.head.querySelector('link[rel="canonical"]') || document.createElement('link')

        document.title = title
        setMetaTag('name', 'description', description)
        setMetaTag('property', 'og:title', title)
        setMetaTag('property', 'og:description', description)
        setMetaTag('property', 'og:url', url)

        if (image) {
            setMetaTag('property', 'og:image', new URL(image, window.location.origin).href)
        }

        canonical.setAttribute('rel', 'canonical')
        canonical.setAttribute('href', url)
        document.head.appendChild(canonical)
    }, [description, image, title])

    return null
}


function App() {

    function NavFilterMenu({ buttons }) {
        return <div className='BtnFilter'>{buttons}</div>
    }

    // Restore the total number of completed quizzes when the app starts.
    const [QuizTotalCount, setQuizTotalCount] = useState(() => {
        return Number(localStorage.getItem("QuizTotalCount")) || 0;
    });

    // Restore the user's selected page theme from local storage.
    const [pageColor, setPageColor] = useState(
        () => localStorage.getItem("PageColor") || "Main"
    )


    // Persist the completed quiz count whenever it changes.
    useEffect(() => {
        localStorage.setItem("QuizTotalCount", QuizTotalCount);



    }, [QuizTotalCount]);



    // Apply and persist the selected theme for the whole document.
    useEffect(() => {
        const activeBackground = pageColor === 'Changed'
            ? 'black'
            : 'linear-gradient(to right, red, purple)'

        document.body.style.background = activeBackground
        document.documentElement.style.background = activeBackground
        document.body.style.backgroundAttachment = 'fixed'
        document.documentElement.style.backgroundAttachment = 'fixed'

        localStorage.setItem("PageColor", pageColor)
    }, [pageColor])



    function HomePage({ pageColor, setPageColor }) {
        const navigate = useNavigate()

        // Switch to the dark theme and persist the selection immediately.
        function ChangePageColor() {
            setPageColor('Changed')
            localStorage.setItem('PageColor', 'Changed')
        }

        // Restore the default theme and persist the selection immediately.
        function MainPageColor() {
            setPageColor('Main')
            localStorage.setItem('PageColor', 'Main')
        }
        const [activeFilter, setActiveFilter] = useState('MainBtn');

        function FilterBtn(event) {
            setActiveFilter(event.currentTarget.name);
        }

        const FilterQuizses = quizzses.filter((quiz) => {
            if (activeFilter === "MainBtn") {
                return true;
            }

            if (activeFilter === "PersonalityBtn") {
                return quiz.type === "personality"
            }

            if (activeFilter === "KnowladgleBtn") {
                return quiz.type === "knowladge";

            }



        })



        return (
            <>
                <Seo
                    title="QuestArcade | Oyun Quizleri"
                    description="Minecraft, GTA, Valorant ve daha fazla oyun hakkında bilgi ve kişilik quizlerini çözün. QuestArcade ile oyun bilginizi test edin."
                    image={normalizeAssetPath('/LOGO.png')}
                />
                <header>
                    <div className='header_size'>
                        <h1 className='HeaderTitle'>Oyun Quizleri ve Kişilik Testleri | QuestArcade</h1>
                        <p className='PageInfo'>Şimdi Testleri Çözmeye Başlayarak, Ne Kadar İyi Bir Oyuncu Olduğunu Test Et !</p>
                    </div>
                    <div className='QuestPlayLogo'>
                        <img src={questPlayLogo} alt='QuestPlaylogo' width='260' height='129' fetchPriority='high' />
                    </div>
                    <nav>
                        <NavFilterMenu
                            buttons={
                                <>
                                    <button name='MainBtn' className={activeFilter === "MainBtn" ? 'activeBtn' : ''} onClick={FilterBtn}>BÜTÜN TESTLER BİR ARADA</button>
                                    <button name='PersonalityBtn' className={activeFilter === "PersonalityBtn" ? 'activeBtn' : ''} onClick={FilterBtn}>SADECE KİŞİLİK TESTLERİ</button>
                                    <button name='KnowladgleBtn' className={activeFilter === "KnowladgleBtn" ? 'activeBtn' : ''} onClick={FilterBtn}>SADECE BİLGİ TESTLERİ</button>
                                </>
                            }


                        >
                        </NavFilterMenu>



                    </nav>

                    <span className='changecolor_info'>
                        <h3>Buradan Sayfa Arayüz Rengini Değiştirebilirsin !</h3>
                    </span>

                    <nav>
                        <div className='UserCountContainer'>
                            <h2 className='UserCountInfo'>Toplam Çözülen Test Sayısı: {QuizTotalCount}</h2>
                        </div>

                    </nav>

                    <section>
                        <div className='QuestContainer'>
                            <div className='QuestStyles'>
                                {/* Each image acts as a link to its corresponding quiz. */}
                                {FilterQuizses.map((quiz) => (
                                    quiz.image ? (
                                        <img
                                            key={quiz.id}
                                            src={normalizeAssetPath(quiz.image)}
                                            alt={quiz.title}
                                            loading='lazy'
                                            decoding='async'
                                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                                        />
                                    ) : (
                                        <button
                                            key={quiz.id}
                                            className='QuestPlaceholder'
                                            type='button'
                                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                                        >
                                            {quiz.title}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className='ChanePageColors'>
                        <div className='ChangeColorContainer'>
                            <div className='ChangePageColorStyle'>
                                <div className='ChangeColorItems'>
                                    <button className='changePageColor' onClick={ChangePageColor}>
                                        <img src='/dark.png' title='Karanlık Temaya Geç' width='100' height='100' loading='lazy' decoding='async' />
                                        <span className='black_info'>Karanlık Temaya Geç</span>
                                    </button>

                                    <button className='mainPageColor' onClick={MainPageColor}>
                                        <img src='/main.png' title='Ana Temaya Geri Dön' width='100' height='100' loading='lazy' decoding='async' />
                                        <span className='main_color_info'>Ana Temaya Geri Dön</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header >
            </>
        )
    }

    function QuizRoute({ setQuizTotalCount }) {
        const { id } = useParams()
        const navigate = useNavigate()
        // Match the URL parameter with one of the available quiz definitions.
        const quiz = quizzses.find((item) => item.id === id)

        const quizTitle = quiz?.title || 'Quiz bulunamadı'
        const quizDescription = quiz
            ? `${quiz.title} çözerek oyun bilginizi test edin. QuestArcade üzerindeki eğlenceli oyun quizini hemen deneyin.`
            : 'Aradığınız quiz QuestArcade üzerinde bulunamadı.'

        return (
            <>
                <Seo
                    title={`${quizTitle} | QuestArcade`}
                    description={quizDescription}
                    image={normalizeAssetPath(quiz?.image || '/LOGO.png')}
                />

                {/* Keep invalid quiz URLs from rendering an incomplete quiz page. */}
                {!quiz ? (
                    <p>Quiz bulunamadı.</p>
                ) : (
                    <QuizPage quiz={quiz}
                        onBack={() => navigate('/')}
                        setQuizTotalCount={setQuizTotalCount} />
                )}
            </>
        )
    }



    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage
                    pageColor={pageColor}
                    setPageColor={setPageColor}
                    setQuizTotalCount={setQuizTotalCount}


                />} />
                <Route
                    path='/quiz/:id'
                    element={
                        <Suspense fallback={<p className='PageLoading'>Quiz yükleniyor...</p>}>
                            <QuizRoute
                                setQuizTotalCount={setQuizTotalCount}
                            />
                        </Suspense>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
