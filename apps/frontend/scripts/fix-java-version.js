const fs = require('fs');
const path = require('path');

// Calea către directorul Android
const androidDir = path.join(__dirname, '..', 'android');

// Fișiere de actualizat
const filesToUpdate = [
  path.join(androidDir, 'build.gradle'),
  path.join(androidDir, 'app', 'build.gradle'),
  path.join(androidDir, 'capacitor-android', 'build.gradle'),
  path.join(androidDir, 'capacitor-cordova-android-plugins', 'build.gradle')
];

// Verifică fiecare fișier și adaugă configurația Java 17
filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verifică dacă fișierul are deja compileOptions
    if (content.includes('compileOptions {')) {
      // Înlocuiește orice versiune Java cu Java 17
      content = content.replace(
        /sourceCompatibility JavaVersion\.VERSION_\d+/g, 
        'sourceCompatibility JavaVersion.VERSION_17'
      );
      content = content.replace(
        /targetCompatibility JavaVersion\.VERSION_\d+/g, 
        'targetCompatibility JavaVersion.VERSION_17'
      );
    } else if (content.includes('android {')) {
      // Adaugă compileOptions dacă nu există
      content = content.replace(
        /android\s*{[^}]*?(?=\n\s*})/gs,
        match => `${match}\n    compileOptions {\n        sourceCompatibility JavaVersion.VERSION_17\n        targetCompatibility JavaVersion.VERSION_17\n    }`
      );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated Java version in ${filePath}`);
  }
});

console.log('Java version fix completed!'); 