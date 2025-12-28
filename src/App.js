import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Search, Bell, X, Check, Plus, ThumbsUp, Volume2, VolumeX, Film } from 'lucide-react';
import './App.css';

const NetflixClone = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [muted, setMuted] = useState(true);

  const categories = {
    trending: [
      { id: 1, title: 'Stranger Things', color: '#8B0000', featured: true, desc: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.' },
      { id: 2, title: 'The Crown', color: '#4B0082', desc: 'Chronicles the life of Queen Elizabeth II from the 1940s to modern times, exploring the personal intrigues behind the public face of royalty.' },
      { id: 3, title: 'Dark', color: '#1C1C1C', desc: 'A family saga with a supernatural twist set in a small German town where the disappearance of children exposes relationships among four families.' },
      { id: 4, title: 'Ozark', color: '#0F4C81', desc: 'A financial advisor relocates his family to the Ozarks after a money laundering scheme goes wrong, forcing them to pay off a drug lord.' },
      { id: 5, title: 'Breaking Bad', color: '#2E8B57', desc: 'A high school chemistry teacher turned methamphetamine producer partners with a former student to secure his family\'s future.' }
    ],
    action: [
      { id: 6, title: 'Extraction', color: '#B22222', desc: 'A black-market mercenary who has nothing to lose is hired to rescue the kidnapped son of an imprisoned international crime lord.' },
      { id: 7, title: 'The Gray Man', color: '#696969', desc: 'When a shadowy CIA agent uncovers damning agency secrets, he is hunted across the globe by his former colleague and international assassins.' },
      { id: 8, title: 'Red Notice', color: '#DC143C', desc: 'An Interpol agent tracks the world\'s most wanted art thief in a daring heist that spans the globe.' },
      { id: 9, title: 'The Witcher', color: '#8B4513', desc: 'Geralt of Rivia, a mutated monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.' },
      { id: 10, title: 'Army of the Dead', color: '#556B2F', desc: 'Following a zombie outbreak in Las Vegas, a group of mercenaries take the ultimate gamble by venturing into the quarantine zone.' }
    ],
    comedy: [
      { id: 11, title: 'The Office', color: '#FF6347', desc: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes and inappropriate behavior.' },
      { id: 12, title: 'Brooklyn Nine-Nine', color: '#4169E1', desc: 'Brilliant but immature detective Jake Peralta must learn to follow the rules when a new commanding officer takes over his precinct.' },
      { id: 13, title: 'Friends', color: '#9370DB', desc: 'Six friends navigate the ups and downs of life and love in New York City while always being there for one another.' },
      { id: 14, title: 'The Good Place', color: '#20B2AA', desc: 'Four people and their otherworldly frienemy struggle in the afterlife to define what it means to be good.' },
      { id: 15, title: 'Schitts Creek', color: '#DAA520', desc: 'After suddenly losing their fortune, the Rose family is forced to rebuild their lives in a small town they once bought as a joke.' }
    ],
    drama: [
      { id: 16, title: 'Better Call Saul', color: '#CD853F', desc: 'The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful encounter with Walter White.' },
      { id: 17, title: 'Narcos', color: '#8B4789', desc: 'Chronicles the rise and fall of Colombian drug lord Pablo Escobar and the DEA agents who fought to bring him to justice.' },
      { id: 18, title: 'Vikings', color: '#2F4F4F', desc: 'Vikings transports us to the brutal world of Ragnar Lothbrok, a Viking warrior and farmer who yearns to explore the ocean.' },
      { id: 19, title: 'Peaky Blinders', color: '#191970', desc: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.' },
      { id: 20, title: 'Money Heist', color: '#8B0000', desc: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history by breaking into the Royal Mint.' }
    ]
  };

  const handleAuth = () => {
    if (email && password) {
      if (isSignUp && !name) {
        alert('Please enter your name');
        return;
      }
      setUser({ email, profile: name || 'User' });
      setShowLogin(false);
    }
  };

  const toggleMyList = (movie) => {
    setMyList(prev => {
      const exists = prev.find(m => m.id === movie.id);
      if (exists) {
        return prev.filter(m => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  const isInMyList = (movieId) => myList.some(m => m.id === movieId);

  const MovieCard = ({ movie, onClick }) => {
    return (
      <div
        onClick={onClick}
        className="movie-card"
        style={{ background: `linear-gradient(135deg, ${movie.color} 0%, #000000 100%)` }}
      >
        <div className="movie-card-icon">
          <Film size={48} />
        </div>
        <div className="movie-card-overlay"></div>
        <div className="movie-card-content">
          <h3>{movie.title}</h3>
          <div className="movie-card-rating">
            <div className="rating-bar"></div>
            <div className="rating-bar"></div>
            <div className="rating-bar half"></div>
          </div>
        </div>
      </div>
    );
  };

  const MovieRow = ({ title, movies, rowId }) => {
    const rowRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const scroll = (direction) => {
      if (rowRef.current) {
        const scrollAmount = direction === 'left' ? -800 : 800;
        rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        
        setTimeout(() => {
          checkScroll();
        }, 300);
      }
    };

    const checkScroll = () => {
      if (rowRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setShowLeft(scrollLeft > 0);
        setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    useEffect(() => {
      checkScroll();
    }, []);

    return (
      <div className="movie-row">
        <h2>{title}</h2>
        <div className="movie-row-container">
          {showLeft && (
            <button onClick={() => scroll('left')} className="scroll-btn left">
              <ChevronLeft size={40} />
            </button>
          )}
          <div ref={rowRef} onScroll={checkScroll} className="movie-list">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
          {showRight && (
            <button onClick={() => scroll('right')} className="scroll-btn right">
              <ChevronRight size={40} />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (showLogin) {
    return (
      <div className="login-page">
        <div className="login-background">
          <div className="gradient-overlay"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-circle"
              style={{
                width: Math.random() * 300 + 100 + 'px',
                height: Math.random() * 300 + 100 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: `radial-gradient(circle, ${['#e50914', '#b20710', '#831010'][Math.floor(Math.random() * 3)]} 0%, transparent 70%)`,
              }}
            />
          ))}
        </div>
        
        <div className="login-content">
          <div className="login-header">
            <svg viewBox="0 0 111 30" className="netflix-logo">
              <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 8.686c-1.687-.282-3.344-.376-5.031-.595l6.031-14.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.749V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.719.062V4.687h-4.844V0h14.406v4.687h-4.843zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"/>
            </svg>
          </div>
          
          <div className="login-form-container">
            <div className="login-form">
              <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
              <div>
                {isSignUp && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  className="form-input"
                />
                <button onClick={handleAuth} className="submit-btn">
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
                
                {!isSignUp && (
                  <div className="form-options">
                    <label>
                      <input type="checkbox" />
                      Remember me
                    </label>
                    <button className="link-btn">Need help?</button>
                  </div>
                )}
                
                <div className="form-footer">
                  <span>{isSignUp ? 'Already have an account? ' : 'New to Netflix? '}</span>
                  <button 
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setName('');
                      setEmail('');
                      setPassword('');
                    }}
                    className="link-btn bold"
                  >
                    {isSignUp ? 'Sign in now' : 'Sign up now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredMovie = categories.trending[0];

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <svg viewBox="0 0 111 30" className="netflix-logo-small">
              <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 8.686c-1.687-.282-3.344-.376-5.031-.595l6.031-14.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.749V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.719.062V4.687h-4.844V0h14.406v4.687h-4.843zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"/>
            </svg>
            <nav className="nav">
              <button>Home</button>
              <button>TV Shows</button>
              <button>Movies</button>
              <button>New & Popular</button>
              <button>My List</button>
            </nav>
          </div>
          <div className="header-right">
            <button onClick={() => setShowSearch(!showSearch)}>
              <Search size={20} />
            </button>
            <button>
              <Bell size={20} />
            </button>
            <div className="profile-icon">
              {user.profile[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="hero" style={{ background: `linear-gradient(135deg, ${featuredMovie.color} 0%, #000000 100%)` }}>
        <div className="hero-icon">
          <Film size={400} />
        </div>
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="original-badge">NETFLIX ORIGINAL</div>
            <h1>{featuredMovie.title}</h1>
            <div className="hero-meta">
              <span className="match">98% Match</span>
              <span>2024</span>
              <span className="quality">HD</span>
              <span>3 Seasons</span>
            </div>
            <p>{featuredMovie.desc}</p>
            <div className="hero-buttons">
              <button className="play-btn">
                <Play size={24} fill="currentColor" />
                Play
              </button>
              <button className="info-btn" onClick={() => setSelectedMovie(featuredMovie)}>
                <Info size={24} />
                More Info
              </button>
            </div>
          </div>
        </div>
        <button className="mute-btn" onClick={() => setMuted(!muted)}>
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <div className="content">
        <MovieRow title="Trending Now" movies={categories.trending} rowId="trending" />
        <MovieRow title="Action & Adventure" movies={categories.action} rowId="action" />
        <MovieRow title="Comedies" movies={categories.comedy} rowId="comedy" />
        <MovieRow title="Drama" movies={categories.drama} rowId="drama" />
        {myList.length > 0 && <MovieRow title="My List" movies={myList} rowId="mylist" />}
      </div>

      {selectedMovie && (
        <div className="modal" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hero" style={{ background: `linear-gradient(135deg, ${selectedMovie.color} 0%, #000000 100%)` }}>
              <div className="modal-hero-icon">
                <Film size={200} />
              </div>
              <div className="modal-gradient"></div>
              <button className="close-btn" onClick={() => setSelectedMovie(null)}>
                <X size={24} />
              </button>
              <div className="modal-hero-content">
                <h2>{selectedMovie.title}</h2>
                <div className="modal-buttons">
                  <button className="play-btn">
                    <Play size={20} fill="currentColor" />
                    Play
                  </button>
                  <button className="icon-btn" onClick={(e) => { e.stopPropagation(); toggleMyList(selectedMovie); }}>
                    {isInMyList(selectedMovie.id) ? <Check size={20} /> : <Plus size={20} />}
                  </button>
                  <button className="icon-btn">
                    <ThumbsUp size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-meta">
                <span className="match">98% Match</span>
                <span>2024</span>
                <span className="quality">HD</span>
              </div>
              <p>{selectedMovie.desc}</p>
              <div className="modal-info">
                <div>
                  <span className="label">Cast: </span>
                  <span>Various Artists</span>
                </div>
                <div>
                  <span className="label">Genres: </span>
                  <span>Drama, Thriller, Action</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetflixClone;