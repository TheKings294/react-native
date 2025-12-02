# Comment créer une nouvelle page (Step-by-Step)

Salut Moustapha ! Voici comment ajouter une nouvelle page proprement dans le projet.

On sépare toujours la **logique** (dans `src`) de la **navigation** (dans `app`).

### Étape 1 : Créer l'écran (Le design et la logique)
C'est ici que tu codes ton interface.

1. Crée un nouveau dossier pour ta feature dans `src/features/` (ex: `mon-test`).
2. Crée le fichier composant (ex: `MonTestScreen.tsx`).

**Exemple :** `src/features/mon-test/MonTestScreen.tsx`
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MonTestScreen() {
  return (
    <View style={styles.container}>
      <Text>Salut c'est ma nouvelle page !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Étape 2 : Créer la route (L'URL)
C'est ce fichier qui rend ta page accessible via la navigation.

1. Va dans le dossier `app/`.
2. Crée un fichier avec le nom que tu veux pour l'URL (ex: `test.tsx`).
3. Importe simplement ton écran de l'étape 1 et exporte-le.

**Exemple :** `app/test.tsx`
```tsx
import MonTestScreen from '@/features/mon-test/MonTestScreen';
export default MonTestScreen;
```

### C'est tout !
Ta page est maintenant accessible.
Si tu veux l'ajouter à la navigation principale ou changer son titre, tu peux aller dans `app/_layout.tsx` :

```tsx
<Stack.Screen name="test" options={{ title: 'Ma Super Page' }} />
```
