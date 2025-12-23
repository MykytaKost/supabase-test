# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

T# Dokumentacja projektu – Allegro Clone

## 1. Opis projektu

Aplikacja typu e-commerce (klon Allegro) umożliwiająca:

* przeglądanie produktów
* rejestrację i logowanie użytkowników
* dodawanie produktów do koszyka
* składanie zamówień
* zarządzanie produktami (panel admina)

Frontend: **Vue 3 + Pinia + Vue Router**
Backend / Baza danych: **Supabase (PostgreSQL + Auth)**

---

## 2. Struktura bazy danych

### 2.1 Tabela `profiles`

Przechowuje dane użytkowników aplikacji.

| Pole       | Typ       | Opis                                     |
| ---------- | --------- | ---------------------------------------- |
| id         | uuid      | Klucz główny (powiązany z auth.users.id) |
| email      | text      | Adres email użytkownika                  |
| full_name  | text      | Imię i nazwisko                          |
| created_at | timestamp | Data utworzenia                          |

Relacja: `profiles.id → auth.users.id`

---

### 2.2 Tabela `products`

Przechowuje ofertę produktów.

| Pole        | Typ       | Opis            |
| ----------- | --------- | --------------- |
| id          | int8      | Klucz główny    |
| name        | text      | Nazwa produktu  |
| description | text      | Opis produktu   |
| price       | numeric   | Cena produktu   |
| image_url   | text      | Link do zdjęcia |
| category_id | int8      | Kategoria       |
| stock       | int4      | Stan magazynowy |
| created_at  | timestamp | Data dodania    |

Relacja: `products.category_id → categories.id`

---

### 2.3 Tabela `categories`

Kategorie produktów.

| Pole | Typ  | Opis            |
| ---- | ---- | --------------- |
| id   | int8 | Klucz główny    |
| name | text | Nazwa kategorii |
| slug | text | Przyjazny URL   |

---

### 2.4 Tabela `orders`

Zamówienia składane przez użytkowników.

| Pole        | Typ         | Opis                 |
| ----------- | ----------- | -------------------- |
| id          | int8        | Klucz główny         |
| user_id     | uuid        | Id użytkownika       |
| total_price | numeric     | Łączna cena          |
| status      | text        | Status (np. pending) |
| address     | jsonb       | Adres dostawy        |
| created_at  | timestamptz | Data zamówienia      |

Relacja: `orders.user_id → profiles.id`

---

### 2.5 Tabela `order_items`

Pozycje w zamówieniu.

| Pole       | Typ     | Opis                   |
| ---------- | ------- | ---------------------- |
| id         | int8    | Klucz główny           |
| order_id   | int8    | Id zamówienia          |
| product_id | int8    | Id produktu            |
| quantity   | int4    | Ilość                  |
| price      | numeric | Cena w momencie zakupu |

Relacje:

* `order_items.order_id → orders.id`
* `order_items.product_id → products.id`

---

## 3. API – Produkty

### Pobieranie listy produktów

Źródło: `productStore.fetchProducts()`

**Zapytanie (Supabase):**

* tabela: `products`
* sortowanie: `created_at DESC`

**Przykładowa odpowiedź:**

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 2999.99,
    "image_url": "https://...",
    "stock": 5
  }
]
```

---

### Dodawanie produktu

Źródło: `productStore.addProduct()`

⚠️ **Aktualny stan aplikacji:**

* dodawanie produktów **nie jest ograniczone rolami**
* **każdy użytkownik** (również niezalogowany) może dodać produkt do bazy

---

### Usuwanie produktu

Źródło: `productStore.deleteProduct()`

⚠️ **Aktualny stan aplikacji:**

* usuwanie produktów **również nie jest ograniczone**
* **każdy użytkownik** ma możliwość usunięcia produktu z bazy danych

🔧 W przyszłości funkcjonalność ta powinna zostać ograniczona wyłącznie do kont administratorów (np. przez RLS lub role użytkowników).

---

## 4. API – Autoryzacja

### Rejestracja użytkownika

Źródło: `authStore.handleRegister()`

* email
* hasło

Supabase automatycznie tworzy wpis w `auth.users`.

---

### Logowanie użytkownika

Źródło: `authStore.handleLogin()`

Po zalogowaniu:

* użytkownik zapisywany w stanie aplikacji
* dostęp do składania zamówień

---

## 5. API – Koszyk

### Dodawanie produktu do koszyka

Źródło: `cartStore.addToCart()`

Logika:

* jeśli produkt już istnieje → zwiększenie ilości
* jeśli nie → dodanie nowej pozycji

---

### Usuwanie produktu

Źródło: `cartStore.removeFromCart()`

---

### Aktualizacja ilości

Źródło: `cartStore.updateQuantity()`

---

### Składanie zamówienia

Źródło: `cartStore.placeOrder()`

Kroki:

1. Wstawienie rekordu do `orders`
2. Wstawienie pozycji do `order_items`
3. Wyczyszczenie koszyka

---

## 6. Routing aplikacji

| Ścieżka      | Widok          | Opis                    |
| ------------ | -------------- | ----------------------- |
| /            | HomeView       | Lista produktów         |
| /login       | LoginView      | Logowanie / rejestracja |
| /add-product | AddProductView | Dodawanie produktów     |
| /cart        | CartView       | Koszyk                  |

---

## 7. Bezpieczeństwo – Row Level Security (RLS)

W projekcie zastosowano mechanizm **Row Level Security (RLS)** w Supabase, który ogranicza dostęp do danych na poziomie wierszy tabeli, w zależności od zalogowanego użytkownika.

### 7.1 Tabela `categories`

* **SELECT**: dostęp publiczny (`anon`, `authenticated`)
* Kategorie mogą być odczytywane przez wszystkich użytkowników (również niezalogowanych)

Przykładowa polityka:

```sql
USING (true)
```

---

### 7.2 Tabela `products`

Aktywne polityki:

* **SELECT** – publiczny odczyt produktów (`anon`, `authenticated`)
* **INSERT** – tylko użytkownicy zalogowani (`authenticated`)
* **DELETE** – obecnie dostęp publiczny (stan projektowy)

⚠️ Uwaga projektowa:
Usuwanie produktów nie jest ograniczone do administratorów. Jest to świadoma decyzja projektowa na etapie demonstracyjnym.

Przykładowe polityki:

```sql
-- Publiczny odczyt
USING (true)

-- Insert tylko dla zalogowanych
WITH CHECK (auth.role() = 'authenticated')
```

---

### 7.3 Tabela `orders`

Aktywne polityki:

* **INSERT** – użytkownik może dodać tylko własne zamówienie
* **SELECT** – użytkownik widzi tylko swoje zamówienia

Warunek bezpieczeństwa:

```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

---

### 7.4 Tabela `order_items`

Aktywne polityki:

* **INSERT** – użytkownik może dodawać pozycje tylko do swoich zamówień
* **SELECT** – użytkownik widzi tylko pozycje powiązane z jego zamówieniami

Przykładowa logika:

```sql
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
)
```

---

### 7.5 Tabela `profiles`

RLS jest włączony, ale **brak polityk**:

* dane profili nie są obecnie dostępne przez Supabase API
* tabela przygotowana pod przyszłą rozbudowę (np. role użytkowników)

Docelowo możliwe polityki:

* użytkownik widzi i edytuje tylko własny profil
