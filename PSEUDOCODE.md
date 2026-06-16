# UniMate Campus Companion - Concise Logical Pseudocode

This document outlines the core architecture, data flows, and key algorithms of the UniMate application in a compact and high-level format.

---

## 1. Notes Repository
Digital library for books, past papers, and lecture notes.

### Database Schema (`repository_items`)
```sql
CREATE TABLE repository_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('book', 'note', 'past_paper')),
    course_name TEXT,
    course_teacher_name TEXT,
    batch VARCHAR(20),
    file_url TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'disapproved')) DEFAULT 'pending'
);
```

### Core Logic Flows
```python
# FRONTEND (Repository.tsx)
State: items = [], search = "", category = "All", batch = "All"

OnLoad:
    # 1. Fetch unique batches of approved items
    availableBatches = SELECT DISTINCT batch FROM repository_items WHERE status = 'approved'
    # 2. Fetch approved library contents
    items = SELECT * FROM repository_items WHERE status = 'approved' AND (batch = selectedBatch OR selectedBatch = 'All')

OnClientFilter:
    filtered = items.Filter(item -> 
        (category == "All" or item.type == category) AND
        (search in item.title or search in item.course_name or search in item.course_teacher_name)
    )

# SUBMIT UPLOAD MODAL
UploadItem(title, type, course, teacher, batch, fileUri):
    IF EXISTS(item in repository_items WHERE user_id = CurrentUser.id AND title = title AND status = 'open'):
        Error("Duplicate upload pending approval.")
    ELSE:
        INSERT INTO repository_items(title, type, course_name, course_teacher_name, batch, file_url, status)
        VALUES(title, type, course, teacher, batch, fileUri, 'pending')
```

---

## 2. AI Chatbot (RAG & Multi-AI Fallback)
Authorized campus companion using local RAG (Fuse.js) with Google Gemini & OpenRouter fallbacks.

### Core Logic Flows
```python
# FRONTEND (chatbot.tsx)
State: messages = User.chatbot_history OR [GreetingMsg]

OnSendMessage(text):
    messages.Append({ role: "user", content: text })
    isTyping.Set(True)
    TRY:
        reply = Await queryUniMate(text, messages)
        messages.Append({ role: "bot", content: reply })
        UpdateProfileInSupabase({ chatbot_history: Encrypt(messages) })
    CATCH:
        messages.Append({ role: "bot", content: "AI offline. Try again later." })
    FINALLY:
        isTyping.Set(False)

# BACKEND AI ORCHESTRATION (aiController.ts & chatbotService.ts)
queryUniMate(query, history):
    # 1. Retrieval (RAG)
    context = FuseSearch(comsats_dataset, query).Limit(5).Join("\n")
    
    # 2. Build Authoritative Prompt
    systemPrompt = f"You are the UniMate COMSATS expert. Context:\n{context}\nUser: {query}"
    
    # 3. Primary AI (Gemini 2.5 Flash)
    TRY:
        payload = FormatGeminiPayload(systemPrompt, history)
        RETURN POST(GEMINI_API, payload).text
    # 4. Fallback AI (OpenRouter)
    CATCH:
        openAIFormat = FormatToOpenAIMessages(history, systemPrompt)
        RETURN POST(OPENROUTER_API, { model: "openrouter/auto", messages: openAIFormat }).content
```

---

## 3. Lost & Found Feed
Reporting board featuring dual-tab feeds and instant claim resolution.

### Database Schema
```sql
CREATE TABLE lost_found_posts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    item_name TEXT,
    description TEXT,
    type VARCHAR(10) CHECK (type IN ('lost', 'found')),
    status VARCHAR(10) CHECK (status IN ('open', 'resolved')) DEFAULT 'open',
    resolved_with_id UUID REFERENCES auth.users
);
```

### Core Logic Flows
```python
# SUBMIT ITEM
CreateReport(itemName, description, type):
    VerifyNoPendingDuplicate(itemName, CurrentUser.id)
    INSERT INTO lost_found_posts(user_id, item_name, description, type, status)
    BroadcastPushNotification(f"New {type} item reported: {itemName}")

# CLAIMS & RESOLUTION
ClaimItem(postId, claimerMessage):
    INSERT INTO lost_found_claims(post_id, claimer_id, message: Encrypt(claimerMessage), status: 'pending')
    # Trigger ephemeral ChatRoom for owner/claimer coordination

ResolveItem(postId, claimerId):
    UPDATE lost_found_posts SET status = 'resolved', resolved_with_id = claimerId WHERE id = postId
    UPDATE lost_found_claims SET status = 'accepted' WHERE post_id = postId AND claimer_id = claimerId
```

---

## 4. Lend & Borrow Feed
P2P sharing network with duration reminders and completion reminders.

### Database Schema
```sql
CREATE TABLE borrow_requests (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    item_name TEXT,
    reason TEXT,
    duration VARCHAR(50),
    status VARCHAR(10) CHECK (status IN ('open', 'active', 'completed')) DEFAULT 'open'
);
```

### Core Logic Flows
```python
# LEND / BORROW WORKFLOW
CreateBorrowRequest(itemName, duration):
    INSERT INTO borrow_requests(user_id, item_name, duration, status: 'open')
    BroadcastLendBorrowNotification(f"Someone needs: {itemName}")

OfferToLend(requestId, offerMsg):
    INSERT INTO borrow_offers(request_id, lender_id, message: Encrypt(offerMsg), status: 'pending')

AcceptLendOffer(offerId, requestId):
    UPDATE borrow_offers SET status = 'accepted' WHERE id = offerId
    UPDATE borrow_requests SET status = 'active' WHERE id = requestId
    CreateChatRoom(Lender, Borrower)

CompleteBorrowCycle(requestId):
    UPDATE borrow_requests SET status = 'completed', resolved_at = Now() WHERE id = requestId
    SendPrivatePushNotification(Lender, "Verify returned item confirmation.")
```

---

## 5. Voice Notes Generator & Structured Archive
Speech-to-text recording pipeline creating structured academic logs via Gemini.

### Database Schema
```sql
CREATE TABLE lecture_notes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    course_id VARCHAR(50),
    professor_name TEXT,
    lecture_date DATE,
    title TEXT,
    overview TEXT,
    key_concepts TEXT[],       -- String array
    sections JSONB,            -- [{heading: string, content: string}]
    summary TEXT
);
```

### Core Logic Flows
```python
# FRONTEND RECORDER (LectureNotes.tsx)
OnRecordPress():
    IF isRecording == False:
        AudioService.Start()
        isRecording.Set(True)
    ELSE:
        isRecording.Set(False)
        audioFile = AudioService.Stop()
        base64Audio = ConvertToBase64(audioFile)
        
        # Request backend translation
        structuredNotes = POST("/ai/transcribe-lecture", { audioBase64: base64Audio, mimeType: "audio/m4a" })
        SaveNotesModal(structuredNotes)

# BACKEND AUDIO COMPILING (aiController.ts)
TranscribeAudioEndpoint(req):
    Prompt = """
    Transcribe and structure this audio recording of a lecture.
    Return ONLY a JSON object:
    { "title": "...", "overview": "...", "key_concepts": ["..."], "sections": [{"heading": "...", "content": "..."}], "summary": "..." }
    """
    payload = PrepareGeminiAudioPayload(Prompt, req.body.audioBase64, req.body.mimeType)
    aiResponse = CallAIWithFallback(payload, isAudio=True)
    RETURN JSON.Parse(CleanMarkdownWraps(aiResponse))
```

---

## 6. Personalized & Batch Timetable
Registration card course extraction linking dynamic real-time attendance trackers.

### Core Logic Flows
```python
# REGISTRATION CARD PARSING (Frontend -> Backend)
UploadRegistrationCard(cardImageUri):
    base64Image = ConvertToBase64(cardImageUri)
    
    # AI returns JSON array: [{"course_code": "CSC211", "batch_code": "SP24-BCS-A", "subject": "DLD"}]
    extractedCourses = POST("/ai/extract-courses", { base64Image })
    
    # Save extracted courses inside current student's user profile
    UpdateProfileInSupabase({ timetable_data: extractedCourses })

# STUDENT TIMETABLE VIEW (Timetable.tsx)
OnLoad():
    IF isPersonalized:
        courses = AuthContext.User.timetable_data
        schedule = SELECT * FROM master_timetable WHERE MatchesAnyCourseAndSection(courses)
    ELSE:
        schedule = SELECT * FROM master_timetable WHERE batch_code = User.default_batch_code
    
    timetableData.Set(schedule)

# ATTENDANCE UPDATING
OnClassSwipe(classId, date, currentStatus):
    newStatus = (currentStatus == "taken") ? "missed" : "taken"
    UpdateProfileInSupabase({ attendance_data: { [date]: { [classId]: newStatus } } })
```

---

## 7. Free Slots Search Algorithm
Calculates unused classroom intervals by processing master schedules.

### Core Logic Flows
```python
# BACKEND FREE SLOTS PARSER (timetableController.ts)
GetFreeSlots():
    results = ParseMasterExcelSchedules() # Loaded master data
    cutoffMinutes = TimeToMinutes("20:30") # Limit evening slots
    freeSlotsByDay = []
    
    # Group scheduled classes by day and table location
    classScheduleMap = GroupByDayAndTable(results)
    
    FOR tableIndex, tb IN TimeBlocks:
        lastIndex = tb.startTimes.Length - 1
        
        FOR day IN tb.Days:
            classes = classScheduleMap.Get(f"{tableIndex}||{day}", [])
            slots = []
            idx = 0
            
            WHILE idx <= lastIndex:
                currentClass = FindClassBeginningAt(idx, classes)
                
                IF currentClass:
                    slots.Push({ type: "class", title: currentClass.title })
                    idx = currentClass.endIdx + 1
                ELSE:
                    # Scan for consecutive empty slots
                    nextClassIdx = idx
                    WHILE nextClassIdx <= lastIndex AND NOT HasClassStartingAt(nextClassIdx, classes):
                        nextClassIdx++
                        
                    freeStart = tb.startTimes[idx]
                    freeEnd = tb.endTimes[nextClassIdx - 1]
                    
                    IF TimeToMinutes(freeStart) < cutoffMinutes:
                        slots.Push({
                            type: "free",
                            start: freeStart,
                            end: Min(TimeToMinutes(freeEnd), cutoffMinutes).ToTimeString()
                        })
                    idx = nextClassIdx
            
            freeSlotsByDay.Push({ day, tableIndex, slots })
            
    RETURN freeSlotsByDay
```

---

## 8. Emergency Location/SOS System
Sends quick alarm coordinates directly to guards.

### Database Schema
```sql
CREATE TABLE security_alerts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status VARCHAR(20) DEFAULT 'pending'
);
```

### Core Logic Flows
```python
# FRONTEND SOS ALARM (SecurityButton.tsx)
OnSOSPress():
    HapticWarningFeedback()
    Await LocationContext.RefreshGPSCoordinates()
    
    currentLocation = LocationContext.UserLocation
    IF currentLocation:
        INSERT INTO security_alerts(user_id, latitude, longitude, status)
        VALUES(CurrentUser.id, currentLocation.latitude, currentLocation.longitude, 'pending')
        
        NotifyGuardsAlarm(CurrentUser.name, currentLocation)
        Alert("SOS Dispatched! Campus guards are responding to your location.")
```

---

## 9. Campus POI & Walk Route Navigation
Map overlay plotting routes between campus points of interest.

### Core Logic Flows
```python
# FRONTEND GPS ROUTING (MapScreen.tsx)
State: destination = Null, routeCoords = [], routeDetails = Null

OnPOITapped(point):
    destination.Set(point)
    SaveToRecentHistory(point) # AsyncStorage Cache
    
    TRY:
        # Fetch walking path coords
        { coordinates, distance, duration } = Await getDirections(UserLocation, point)
        routeCoords.Set(coordinates)
        routeDetails.Set({ distance, duration })
    CATCH:
        Error("Path routes unavailable inside structure hulls.")

# SYSTEM MAP HANDOFF
TriggerHardwareGPSApp():
    IF OS == iOS:
        OpenURL(f"comgooglemaps://?daddr={destination.lat},{destination.lng}&directionsmode=walking")
    ELSE:
        OpenURL(f"google.navigation:q={destination.lat},{destination.lng}&mode=w")
```

---

## 10. Interactive Map Tagging System
Translates coordinates on dynamic images to show detailed building overlays.

### Core Logic Flows
```python
# FRONTEND PIN ALIGNMENTS (MapTaggerScreen.tsx)
containerWidth = WindowWidth
containerHeight = WindowWidth * (NaturalMapHeight / NaturalMapWidth)

RenderPins():
    FOR building IN BuildingsDataset:
        # Position pin absolutely on image container using normalized factors (0..1)
        pinLeft = building.x * containerWidth
        pinTop = building.y * containerHeight
        
        RenderPinElement(title=building.short, left=pinLeft, top=pinTop, onPress=() -> ShowPanel(building))

ShowPanel(building):
    selectedBuilding.Set(building)
    ScrollToViewDetailPanel()
```

---

## 11. Semester Story (UniMate Wrapped)
Insight slide aggregator displaying metrics over background timelines.

### Core Logic Flows
```python
# STORIES COMPILING (storyGenerator.ts)
GenerateWrappedDeck(user, attendance, tasks, logs):
    slides = []
    
    # 1. Slide Intro
    slides.Push({ id: "intro", title: "Wrapped", content: f"Hey {user.name}, ready for your Wrapped story?" })
    
    # 2. Slide Productivity
    completedCount = tasks.Filter(t -> t.status == 'done').Length
    slides.Push({ id: "productivity", content: f"You crushed {completedCount} tasks this semester! 🔥" })
    
    # 3. Slide Bunking Report (Attendance rate analysis)
    missedClasses = attendance.Filter(status == 'missed').Length
    rate = CalculateAttendanceRate(attendance)
    slides.Push({ id: "bunks", content: f"Attendance: {rate}%. You skipped {missedClasses} classes... guest student? 💀" })
    
    # 4. Slide Late Night Study Patterns
    midnightHoursCount = logs.Filter(hour(log.timestamp) in [0..4]).Length
    studyType = (midnightHoursCount > 5) ? "Cramming active at 2 AM... are you okay? 🧛" : "Daytime worker."
    slides.Push({ id: "habit", content: studyType })
    
    # 5. Slide GPA prediction
    estimatedGPA = Clamp(2.5 + ((rate / 100) * 1.5), min=0.0, max=4.0)
    slides.Push({ id: "oracle", content: f"Predicted GPA: {estimatedGPA}" })
    
    RETURN slides

# FRONTEND PLAYER (StoryMode.tsx)
PlayDeck():
    progress.Set(0)
    progress.AnimateTo(1, duration=5000, callback=OnSlideTimerEnd)

OnSlideTimerEnd():
    IF currentSlideIndex < slides.Length - 1:
        currentSlideIndex.Increment()
        PlayDeck()
    ELSE:
        CloseStoryDeck()
```

---

## 12. Real-time End-to-End Chat System
Socket.io real-time chat with background database synchronization and encryption.

### Database Schema (`chats`)
```sql
CREATE TABLE chats (
    id UUID PRIMARY KEY,
    room_id VARCHAR(100),
    sender_id UUID REFERENCES auth.users,
    receiver_id UUID REFERENCES auth.users,
    message TEXT, -- Encrypted string
    created_at TIMESTAMP
);
```

### Core Logic Flows
```python
# FRONTEND INTERACTION (ChatRoom.tsx)
OnLoad():
    Socket.Emit("join_room", { room: roomId })
    history = SELECT * FROM chats WHERE room_id = roomId ORDER BY created_at
    messages.Set(history.Map(msg -> Decrypt(msg.message)))
    
    Socket.On("receive_message", (msg) -> {
        IF NOT IsDuplicate(msg.id):
            messages.Append({ ...msg, message: Decrypt(msg.message) })
    })

OnSend(text):
    encrypted = Encrypt(text)
    payload = { id: UUID(), room_id: roomId, sender_id: MyId, receiver_id: TargetId, message: encrypted }
    messages.Append({ ...payload, message: text }) # Optimistic render
    Socket.Emit("send_message", payload)

# BACKEND WEBSOCKET HANDLERS (server.ts)
OnSocketConnection(socket):
    socket.On("join_room", (data) -> socket.Join(data.room))
    
    socket.On("send_message", (payload) -> {
        # Immediate active socket relay
        socket.To(payload.room_id).Emit("receive_message", payload)
        
        # Asynchronous DB write (Keeps WebSocket pipeline unblocked)
        AsyncTaskQueue.Push(() -> {
            INSERT INTO chats(room_id, sender_id, receiver_id, message, created_at)
            VALUES(payload.room_id, payload.sender_id, payload.receiver_id, payload.message, payload.created_at)
        })
    })
```
