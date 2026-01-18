/**
 * Generate Test Data for PasteBox
 *
 * This script generates sample pastes for testing purposes.
 * Run with: npx ts-node scripts/generate-test-data.ts
 */

interface Paste {
    title: string;
    content: string;
    language: string;
}

const CODE_SAMPLES: Record<string, string> = {
    javascript: `// Fibonacci sequence generator
function* fibonacci(limit: number): Generator<number> {
    let [prev, curr] = [0, 1];
    while (curr <= limit) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

// Usage
for (const num of fibonacci(100)) {
    console.log(num);
}`,

    python: `# Quick Sort implementation
def quicksort(arr: list) -> list:
    """Sort array using quicksort algorithm."""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print(f"Sorted: {quicksort(numbers)}")`,

    go: `package main

import (
    "fmt"
    "sync"
)

// Worker pool pattern
func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, job)
        results <- job * 2
    }
}

func main() {
    const numJobs = 5
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)

    var wg sync.WaitGroup
    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)

    wg.Wait()
    close(results)

    for result := range results {
        fmt.Println("Result:", result)
    }
}`,

    rust: `use std::collections::HashMap;

/// Simple LRU Cache implementation
struct LRUCache<K, V> {
    capacity: usize,
    map: HashMap<K, V>,
    order: Vec<K>,
}

impl<K: Clone + Eq + std::hash::Hash, V> LRUCache<K, V> {
    fn new(capacity: usize) -> Self {
        LRUCache {
            capacity,
            map: HashMap::new(),
            order: Vec::new(),
        }
    }

    fn get(&mut self, key: &K) -> Option<&V> {
        if self.map.contains_key(key) {
            self.order.retain(|k| k != key);
            self.order.push(key.clone());
            self.map.get(key)
        } else {
            None
        }
    }

    fn put(&mut self, key: K, value: V) {
        if self.map.len() >= self.capacity && !self.map.contains_key(&key) {
            if let Some(oldest) = self.order.first().cloned() {
                self.map.remove(&oldest);
                self.order.remove(0);
            }
        }
        self.order.retain(|k| k != &key);
        self.order.push(key.clone());
        self.map.insert(key, value);
    }
}

fn main() {
    let mut cache = LRUCache::new(2);
    cache.put("a", 1);
    cache.put("b", 2);
    println!("{:?}", cache.get(&"a")); // Some(1)
}`,

    sql: `-- Create tables for a blog system
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published) WHERE published = TRUE;

-- Query recent published posts with author info
SELECT
    p.id,
    p.title,
    u.username AS author,
    p.created_at
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.published = TRUE
ORDER BY p.created_at DESC
LIMIT 10;`,
};

function generateTestPastes(): Paste[] {
    const pastes: Paste[] = [];

    for (const [language, content] of Object.entries(CODE_SAMPLES)) {
        pastes.push({
            title: \`Sample \${language.charAt(0).toUpperCase() + language.slice(1)} Code\`,
            content,
            language,
        });
    }

    return pastes;
}

async function createPastes(serverUrl: string): Promise<void> {
    const pastes = generateTestPastes();

    console.log(\`Creating \${pastes.length} test pastes...\`);

    for (const paste of pastes) {
        try {
            const response = await fetch(\`\${serverUrl}/api/pastes\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paste),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(\`✓ Created: \${paste.title} (ID: \${data._id})\`);
            } else {
                console.error(\`✗ Failed: \${paste.title}\`);
            }
        } catch (error) {
            console.error(\`✗ Error creating \${paste.title}:\`, error);
        }
    }
}

// Main execution
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

createPastes(SERVER_URL)
    .then(() => console.log('\\nDone!'))
    .catch(console.error);
