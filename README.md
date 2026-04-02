# 🌤️ Weather App - Angular 19

A modern weather application built with **Angular 19**, providing real-time weather conditions and forecasts using the **OpenWeatherMap API**.

---

## 🌟 Features

- 🌍 Select locations by **country and city**  
- 📍 Automatic **geolocation** detection  
- ⛅ **Current weather** conditions with detailed metrics  
- 🕒 **24-hour forecast** with horizontal scrolling  
- 📆 **7-day weather** forecast with daily summaries  
- 📱 **Responsive design** for all devices  
- 🔄 **Real-time updates** using RxJS  
- 💾 Location **persistence with local storage**

---

## 🛠️ Technologies Used

- **Angular 19** – Standalone component architecture  
- **TypeScript** – Type-safe codebase  
- **RxJS** – Reactive programming  
- **Bootstrap 5** – Responsive UI framework  
- **OpenWeatherMap API** – Weather data provider

---

## 🧩 Project Structure

This app utilizes Angular 19's **standalone component** architecture:

- 📦 Components: Dashboard, Location Selector, Forecasts  
- 🔌 Services: API communication, state management  
- 🧾 Interfaces: Type-safe weather data models  
- ⚙️ Configuration: `app.config.ts`, `app.routes.ts`

---

## 🚀 Setup Instructions

### 1. Clone the Repository

<!-- Add git clone and cd command here -->

### 2. Install Dependencies

<!-- Add npm install command here -->

### 3. Set Up Your API Key

- Sign up at [OpenWeatherMap](https://openweathermap.org/)  
- Add your API key in `src/environments/environment.ts`

<!-- Add environment.ts code snippet here -->

### 4. Run the Development Server

<!-- Add ng serve command here -->

Then open your browser and navigate to:  
**http://localhost:4200**

---

## 🧱 Angular 19 Standalone Architecture Highlights

- ❌ No `NgModules` (except for bootstrapping)  
- 🧩 Each component declares its own dependencies  
- 🔧 Configuration via `app.config.ts`  
- 🗺️ Routing via `app.routes.ts`  
- 🚀 Bootstrapped using `bootstrapApplication` in `main.ts`

---

## 👨‍💻 User Guide

1. Select a **country** from the dropdown  
2. Choose or search for a **city**  
3. Click **"Get Weather"** to view the forecast  
4. Or click **"Use my current location"** for auto-detection

---

## 📸 Screenshots

<!-- Add screenshots or markdown image tags here -->

---

## 🔮 Future Enhancements

- 🌡️ Toggle between **Celsius and Fahrenheit**  
- 🗺️ Weather **maps** for precipitation, temperature, etc.  
- 🕰️ Historical weather data  
- 🚨 Weather **alerts and notifications**  
- 🌙 **Dark mode** support  
- 🌐 **Multi-language** support

---

## 🤝 Contributing

Contributions are welcome! 🚀

<!-- Add contributing steps: fork, branch, commit, push, pull request -->

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) – Weather data  
- [Bootstrap](https://getbootstrap.com/) – UI components  
- [Angular](https://angular.io/) – Web application framework

---

## ⭐ Like this project?

Give it a star! It helps others discover the project and motivates further development. 🌟
