/**
 * SmartHostel AI Client Service
 * Communicates with the server-side endpoint (/api/assistant).
 * NEVER calls AI APIs directly from browser code.
 * NEVER stores or exposes GEMINI_API_KEY.
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AssistantApiResponse {
  success: boolean;
  message: string;
}

export async function sendQueryToAssistant(
  message: string,
  history: ChatMessage[],
  getIdToken: () => Promise<string | null>
): Promise<AssistantApiResponse> {
  const cleanMessage = (message || '').trim();
  if (!cleanMessage) {
    return {
      success: false,
      message: 'Please enter a question or query.'
    };
  }

  try {
    const token = await getIdToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication session expired. Please sign in again.'
      };
    }

    // Format sanitized history for the server
    const formattedHistory = history.slice(-4).map(msg => ({
      role: msg.sender === 'assistant' ? 'model' : 'user',
      text: msg.text
    }));

    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        message: cleanMessage,
        history: formattedHistory
      })
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data && data.message) {
        return {
          success: true,
          message: data.message
        };
      }
      return {
        success: false,
        message: data.message || 'SmartHostel AI is temporarily unavailable.'
      };
    }

    // Non-JSON server error fallback
    return {
      success: false,
      message: 'SmartHostel AI is temporarily unavailable. You can still use the Hostel, Smart Mess and Maintenance modules normally.'
    };
  } catch (error) {
    return {
      success: false,
      message: 'SmartHostel AI is temporarily unavailable. You can still use the Hostel, Smart Mess and Maintenance modules normally.'
    };
  }
}
