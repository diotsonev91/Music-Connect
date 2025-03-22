import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import playerReducer from './playerSlice';
import chatReducer from './chatSlice';
import chatSaga from './chatSaga,js';

// ✅ Create saga middleware
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    globalPlayer: playerReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware), // ✅ Attach saga
});

// ✅ Run your saga!
sagaMiddleware.run(chatSaga);
