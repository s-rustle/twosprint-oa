# Contract: Daily App Messages (Instructor → Participants)

**Feature**: 001-overcast-video-classroom  
**Type**: In-band message shapes (Daily useAppMessage)

## Purpose

Instructor actions (mute participant, begin breakout rooms) are signaled via Daily app messages. No backend; participants react to messages and update local state or Daily (e.g. mute mic).

## Message Types

### 1. Mute participant

- **Sender**: Instructor client.
- **Payload**: `{ type: 'mute', sessionId: string }`
- **Receiver**: Target participant (session_id === sessionId) or broadcast; target applies mute (e.g. setLocalAudio(false)).
- **Validation**: sessionId must be a valid Daily session id present in the call.

### 2. Start breakout rooms

- **Sender**: Instructor client.
- **Payload**: `{ type: 'start-breakout' }`
- **Receiver**: All participants (broadcast).
- **Effect**: Clients show “breakout started” UI; assign/end breakout out of scope for this feature.

## Transport

Daily’s `sendAppMessage(data, to)` with `to` = target session id (mute) or broadcast (start-breakout) as per Daily API. Receivers use `onAppMessage` (useAppMessage) to handle payloads.

## Consistency

- Payloads are JSON; type discriminator required. Unknown types ignored.
- No persistence; messages are ephemeral. Re-join restores default state.
