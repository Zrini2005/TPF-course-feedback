import React, { useState, useEffect } from 'react';

const VotingPage: React.FC = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    // Check if user has already voted
    const voted = localStorage.getItem('akhil_vote');
    if (voted) {
      setHasVoted(true);
      setUserVote(voted as 'yes' | 'no');
    }

    // Load vote counts
    const savedVotes = localStorage.getItem('akhil_vote_counts');
    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }
  }, []);

  const handleVote = (vote: 'yes' | 'no') => {
    if (hasVoted) return;

    const newVotes = {
      yes: votes.yes + (vote === 'yes' ? 1 : 0),
      no: votes.no + (vote === 'no' ? 1 : 0)
    };

    setVotes(newVotes);
    setUserVote(vote);
    setHasVoted(true);
    localStorage.setItem('akhil_vote', vote);
    localStorage.setItem('akhil_vote_counts', JSON.stringify(newVotes));
  };

  const totalVotes = votes.yes + votes.no;
  const yesPercentage = totalVotes > 0 ? (votes.yes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (votes.no / totalVotes) * 100 : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '350px',
          height: '350px',
          margin: '0 auto 30px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '5px solid #667eea',
          background: '#f0f0f0'
        }}>
          <img 
            src="/isAkhilGay.jpeg" 
            alt="Akhil"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:60px;color:#667eea">👤</div>';
            }}
          />
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '30px'
        }}>
          Is Akhil Gay?
        </h1>

        {!hasVoted ? (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button
              onClick={() => handleVote('yes')}
              style={{
                padding: '15px 40px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              👍 Yes
            </button>
            <button
              onClick={() => handleVote('no')}
              style={{
                padding: '15px 40px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              👎 No
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: '18px',
                color: '#666',
                marginBottom: '15px'
              }}>
                You voted: <strong style={{ color: userVote === 'yes' ? '#667eea' : '#f5576c' }}>
                  {userVote === 'yes' ? '👍 Yes' : '👎 No'}
                </strong>
              </p>
              <p style={{ fontSize: '14px', color: '#999' }}>
                Total votes: {totalVotes}
              </p>
            </div>

            <div style={{ marginTop: '30px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#667eea' }}>👍 Yes</span>
                  <span style={{ fontWeight: 'bold', color: '#667eea' }}>{yesPercentage.toFixed(1)}%</span>
                </div>
                <div style={{
                  height: '30px',
                  background: '#e0e0e0',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${yesPercentage}%`,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#f5576c' }}>👎 No</span>
                  <span style={{ fontWeight: 'bold', color: '#f5576c' }}>{noPercentage.toFixed(1)}%</span>
                </div>
                <div style={{
                  height: '30px',
                  background: '#e0e0e0',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${noPercentage}%`,
                    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
