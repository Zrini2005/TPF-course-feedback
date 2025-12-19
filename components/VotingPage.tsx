import React, { useState, useEffect } from 'react';

const VOTES_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdJtPgTZHITf3U5DG2sxK3AGyLxzSANQcEBeivE9lsNNe52Uews0UzokilJedq2caZyFn6DxDdCJRv/pub?output=csv";
const FORM_SUBMIT_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeg_-texPjISwaW55zaVI5RQaA6AZKeWasnAEmg_Oah50Rrhg/formResponse";
const FORM_ENTRY_ID = "entry.573701087";

const VotingPage: React.FC = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch vote counts from Google Sheet
  const fetchVotes = async () => {
    try {
      const response = await fetch(VOTES_SHEET_URL);
      const csvText = await response.text();
      
      console.log('Raw CSV:', csvText); // Debug
      
      const lines = csvText.split('\n').filter(line => line.trim());
      
      // Skip header, count votes
      let yesCount = 0;
      let noCount = 0;
      
      // Parse each line (Google Forms: Timestamp, Answer)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        // Find the last comma to get the answer (timestamp might have commas)
        const lastCommaIndex = line.lastIndexOf(',');
        if (lastCommaIndex !== -1) {
          const vote = line.substring(lastCommaIndex + 1)
            .toLowerCase()
            .trim()
            .replace(/['"]/g, '');
          
          console.log(`Line ${i}: "${vote}"`); // Debug
          
          if (vote === 'yes') yesCount++;
          else if (vote === 'no') noCount++;
        }
      }
      
      console.log('Final counts:', { yes: yesCount, no: noCount });
      setVotes({ yes: yesCount, no: noCount });
    } catch (error) {
      console.error('Error fetching votes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user has already voted
    const voted = localStorage.getItem('akhil_vote');
    if (voted) {
      setHasVoted(true);
      setUserVote(voted as 'yes' | 'no');
    }

    // Fetch current vote counts
    fetchVotes();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (vote: 'yes' | 'no') => {
    if (hasVoted) return;

    setUserVote(vote);
    setHasVoted(true);
    localStorage.setItem('akhil_vote', vote);

    // Submit to Google Form
    try {
      const formData = new FormData();
      formData.append(FORM_ENTRY_ID, vote);
      
      await fetch(FORM_SUBMIT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      
      // Refresh vote counts after submission
      setTimeout(fetchVotes, 2000);
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
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
