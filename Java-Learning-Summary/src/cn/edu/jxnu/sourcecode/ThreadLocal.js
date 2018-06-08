package java.lang;
import java.lang.ref.*;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

/**
 * 
 * @author Josh Bloch and Doug Lea
 * @since 1.2
 */
public class ThreadLocal<T> {
    /**
	 * 
	 * 线程局部对象作为键，通过TraceLoad HASHCODE进行搜索 这是一个自定义哈希码（仅在TheleLoad映射中有用），可以消除冲突。
	 * nextHashCode表示了即将分配的下一个ThreadLocal实例的threadLocalHashCode的值。
	 */
    private final int threadLocalHashCode = nextHashCode();

    /**
	 * 下一个哈希码。原子的更新。从零开始。
	 */
    private static AtomicInteger nextHashCode =
            new AtomicInteger();

    /**
	 * 表示了连续分配的两个ThreadLocal实例的threadLocalHashCode值的增量
	 */
    private static final int HASH_INCREMENT = 0x61c88647;

    /**
	 * 返回下一个哈希码
	 */
    private static int nextHashCode() {
        return nextHashCode.getAndAdd(HASH_INCREMENT);
    }

    /**
	 * 线程本地变量的初始值
	 */
    protected T initialValue() {
        return null;
    }

    /**
	 * 根据Supplier初始化
	 * 
	 * @since 1.8
	 */
    public static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier) {
        return new SuppliedThreadLocal<>(supplier);
    }

    /**
	 * 默认初始化
	 */
    public ThreadLocal() {
    }

    /**
	 * 返回当前线程的本地线程变量的副本值 如果变量对于当前线程没有值，则为 首先初始化为调用setInitialValue方法。
	 */
    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
        	// 得到当前线程的Entry
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;// 返回当前线程的Entry的值
            }
        }
        return setInitialValue(); // 调用初始化
    }

    /**
	 * 类似set方法
	 * 
	 * @return the initial value
	 */
    private T setInitialValue() {
        T value = initialValue();
        Thread t = Thread.currentThread(); // 当前线程
        ThreadLocalMap map = getMap(t);// 得到当前线程的ThreadLocalMap对象
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);// 新建ThreadLocalMap对象
        return value; 
    }

    /**
	 * 
	 * 将当前线程局部变量的副本设置为指定值。大多数子类都不需要重写这个方法。
	 * 
	 * 依赖initialValue方法来设置线程局部变量的值
	 */
    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }

    /**
	 * 移除此线程局部变量的当前线程的值。 如果此线程局部变量随后被当前线程的get方法访问，它的值因调用initialValue而将会被重新初始化
	 * 
	 * @since 1.5
	 */
    public void remove() {
        ThreadLocalMap m = getMap(Thread.currentThread());
        if (m != null)
            m.remove(this);
    }

    /**
	 * 获取与线程本地关联的映射map
	 */
    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }

    /**
	 * 创建与线程本地关联的映射
	 * 
	 * 在InheritableThreadLocal被重写。
	 * 
	 * 
	 */
    void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }

    /**
	 * 静态工厂方法，构造方法使用
	 */
    static ThreadLocalMap createInheritedMap(ThreadLocalMap parentMap) {
        return new ThreadLocalMap(parentMap);
    }

    /**
	 */
    T childValue(T parentValue) {
        throw new UnsupportedOperationException();
    }

    /**
	 * ThreadLocal的拓展
	 */
    static final class SuppliedThreadLocal<T> extends ThreadLocal<T> {

        private final Supplier<? extends T> supplier;

        SuppliedThreadLocal(Supplier<? extends T> supplier) {
            this.supplier = Objects.requireNonNull(supplier);
        }

        @Override
        protected T initialValue() {
            return supplier.get();
        }
    }

    /**
     * ThreadLocal最重要的数据结构
	 */
    static class ThreadLocalMap {

        /**
		 * 因为如果这里使用普通的key-value形式来定义存储结构，实质上就会造成节点的生命周期与线程强绑定，只要线程没有销毁，
		 * 那么节点在GC分析中一直处于可达状态，没办法被回收，而程序本身也无法判断是否可以清理节点。
		 * 弱引用是Java中四档引用的第三档，比软引用更加弱一些，如果一个对象没有强引用链可达，
		 * 那么一般活不过下一次GC。当某个ThreadLocal已经没有强引用可达，则随着它被垃圾回收，
		 * 在ThreadLocalMap里对应的Entry的键值会失效，这为ThreadLocalMap本身的垃圾清理提供了便利。
		 */
        static class Entry extends WeakReference<ThreadLocal<?>> {
            /** 与此线程本地关联的值。 */
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }

        /**
		 * 初始大小，2的幂次
		 */
        private static final int INITIAL_CAPACITY = 16;

        /**
		 * 
		 * 大小也是2的幂次
		 * 
		 */
        private Entry[] table;

        /**
		 * 数组中元素的数量
		 */
        private int size = 0;

        /**
         * 触发扩容的临界值
		 */
        private int threshold; // Default to 0

        /**
         * 设置临界值
		 */
        private void setThreshold(int len) {
            threshold = len * 2 / 3;
        }

        /**
		 * Increment i modulo len.
		 */
        private static int nextIndex(int i, int len) {
            return ((i + 1 < len) ? i + 1 : 0);
        }

        /**
		 * Decrement i modulo len.
		 */
        private static int prevIndex(int i, int len) {
            return ((i - 1 >= 0) ? i - 1 : len - 1);
        }

        /**
		 * Construct a new map initially containing (firstKey, firstValue).
		 * ThreadLocalMaps are constructed lazily, so we only create one when we
		 * have at least one entry to put in it.
		 */
        ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
            table = new Entry[INITIAL_CAPACITY];
            int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
            table[i] = new Entry(firstKey, firstValue);
            size = 1;
            setThreshold(INITIAL_CAPACITY);
        }

        /**
		 * Construct a new map including all Inheritable ThreadLocals from given
		 * parent map. Called only by createInheritedMap.
		 * 
		 * @param parentMap
		 *            the map associated with parent thread.
		 */
        private ThreadLocalMap(ThreadLocalMap parentMap) {
            Entry[] parentTable = parentMap.table;
            int len = parentTable.length;
            setThreshold(len);
            table = new Entry[len];

            for (int j = 0; j < len; j++) {
                Entry e = parentTable[j];
                if (e != null) {
                    @SuppressWarnings("unchecked")
                    ThreadLocal<Object> key = (ThreadLocal<Object>) e.get();
                    if (key != null) {
                        Object value = key.childValue(e.value);
                        Entry c = new Entry(key, value);
                        int h = key.threadLocalHashCode & (len - 1);
                        while (table[h] != null)
                            h = nextIndex(h, len);
                        table[h] = c;
                        size++;
                    }
                }
            }
        }

        /**
		 * Get the entry associated with key. This method itself handles only
		 * the fast path: a direct hit of existing key. It otherwise relays to
		 * getEntryAfterMiss. This is designed to maximize performance for
		 * direct hits, in part by making this method readily inlinable.
		 * 
		 * @param key
		 *            the thread local object
		 * @return the entry associated with key, or null if no such
		 */
        private Entry getEntry(ThreadLocal<?> key) {
            int i = key.threadLocalHashCode & (table.length - 1);
            Entry e = table[i];
            if (e != null && e.get() == key)
                return e;
            else
                return getEntryAfterMiss(key, i, e);
        }

        /**
		 * Version of getEntry method for use when key is not found in its
		 * direct hash slot.
		 * 
		 * @param key
		 *            the thread local object
		 * @param i
		 *            the table index for key's hash code
		 * @param e
		 *            the entry at table[i]
		 * @return the entry associated with key, or null if no such
		 */
        private Entry getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e) {
            Entry[] tab = table;
            int len = tab.length;

            while (e != null) {
                ThreadLocal<?> k = e.get();
                if (k == key)
                    return e;
                if (k == null)
                    expungeStaleEntry(i);
                else
                    i = nextIndex(i, len);
                e = tab[i];
            }
            return null;
        }

        /**
		 * Set the value associated with key.
		 * 
		 * @param key
		 *            the thread local object
		 * @param value
		 *            the value to be set
		 */
        private void set(ThreadLocal<?> key, Object value) {

            // We don't use a fast path as with get() because it is at
            // least as common to use set() to create new entries as
            // it is to replace existing ones, in which case, a fast
            // path would fail more often than not.

            Entry[] tab = table;
            int len = tab.length;
            int i = key.threadLocalHashCode & (len-1);

            for (Entry e = tab[i];
                 e != null;
                 e = tab[i = nextIndex(i, len)]) {
                ThreadLocal<?> k = e.get();

                if (k == key) {
                    e.value = value;
                    return;
                }

                if (k == null) {
                    replaceStaleEntry(key, value, i);
                    return;
                }
            }

            tab[i] = new Entry(key, value);
            int sz = ++size;
            if (!cleanSomeSlots(i, sz) && sz >= threshold)
                rehash();
        }

        /**
		 * Remove the entry for key.
		 */
        private void remove(ThreadLocal<?> key) {
            Entry[] tab = table;
            int len = tab.length;
            int i = key.threadLocalHashCode & (len-1);
            for (Entry e = tab[i];
                 e != null;
                 e = tab[i = nextIndex(i, len)]) {
                if (e.get() == key) {
                    e.clear();
                    expungeStaleEntry(i);
                    return;
                }
            }
        }

        /**
		 * Replace a stale entry encountered during a set operation with an
		 * entry for the specified key. The value passed in the value parameter
		 * is stored in the entry, whether or not an entry already exists for
		 * the specified key.
		 * 
		 * As a side effect, this method expunges all stale entries in the "run"
		 * containing the stale entry. (A run is a sequence of entries between
		 * two null slots.)
		 * 
		 * @param key
		 *            the key
		 * @param value
		 *            the value to be associated with key
		 * @param staleSlot
		 *            index of the first stale entry encountered while searching
		 *            for key.
		 */
        private void replaceStaleEntry(ThreadLocal<?> key, Object value,
                                       int staleSlot) {
            Entry[] tab = table;
            int len = tab.length;
            Entry e;

            // Back up to check for prior stale entry in current run.
            // We clean out whole runs at a time to avoid continual
            // incremental rehashing due to garbage collector freeing
            // up refs in bunches (i.e., whenever the collector runs).
            int slotToExpunge = staleSlot;
            for (int i = prevIndex(staleSlot, len);
                 (e = tab[i]) != null;
                 i = prevIndex(i, len))
                if (e.get() == null)
                    slotToExpunge = i;

            // Find either the key or trailing null slot of run, whichever
            // occurs first
            for (int i = nextIndex(staleSlot, len);
                 (e = tab[i]) != null;
                 i = nextIndex(i, len)) {
                ThreadLocal<?> k = e.get();

                // If we find key, then we need to swap it
                // with the stale entry to maintain hash table order.
                // The newly stale slot, or any other stale slot
                // encountered above it, can then be sent to expungeStaleEntry
                // to remove or rehash all of the other entries in run.
                if (k == key) {
                    e.value = value;

                    tab[i] = tab[staleSlot];
                    tab[staleSlot] = e;

                    // Start expunge at preceding stale entry if it exists
                    if (slotToExpunge == staleSlot)
                        slotToExpunge = i;
                    cleanSomeSlots(expungeStaleEntry(slotToExpunge), len);
                    return;
                }

                // If we didn't find stale entry on backward scan, the
                // first stale entry seen while scanning for key is the
                // first still present in the run.
                if (k == null && slotToExpunge == staleSlot)
                    slotToExpunge = i;
            }

            // If key not found, put new entry in stale slot
            tab[staleSlot].value = null;
            tab[staleSlot] = new Entry(key, value);

            // If there are any other stale entries in run, expunge them
            if (slotToExpunge != staleSlot)
                cleanSomeSlots(expungeStaleEntry(slotToExpunge), len);
        }

        /**
		 * Expunge a stale entry by rehashing any possibly colliding entries
		 * lying between staleSlot and the next null slot. This also expunges
		 * any other stale entries encountered before the trailing null. See
		 * Knuth, Section 6.4
		 * 
		 * @param staleSlot
		 *            index of slot known to have null key
		 * @return the index of the next null slot after staleSlot (all between
		 *         staleSlot and this slot will have been checked for
		 *         expunging).
		 */
        private int expungeStaleEntry(int staleSlot) {
            Entry[] tab = table;
            int len = tab.length;

            // expunge entry at staleSlot
            tab[staleSlot].value = null;
            tab[staleSlot] = null;
            size--;

            // Rehash until we encounter null
            Entry e;
            int i;
            for (i = nextIndex(staleSlot, len);
                 (e = tab[i]) != null;
                 i = nextIndex(i, len)) {
                ThreadLocal<?> k = e.get();
                if (k == null) {
                    e.value = null;
                    tab[i] = null;
                    size--;
                } else {
                    int h = k.threadLocalHashCode & (len - 1);
                    if (h != i) {
                        tab[i] = null;

                        // Unlike Knuth 6.4 Algorithm R, we must scan until
                        // null because multiple entries could have been stale.
                        while (tab[h] != null)
                            h = nextIndex(h, len);
                        tab[h] = e;
                    }
                }
            }
            return i;
        }

        /**
		 * Heuristically scan some cells looking for stale entries. This is
		 * invoked when either a new element is added, or another stale one has
		 * been expunged. It performs a logarithmic number of scans, as a
		 * balance between no scanning (fast but retains garbage) and a number
		 * of scans proportional to number of elements, that would find all
		 * garbage but would cause some insertions to take O(n) time.
		 * 
		 * @param i
		 *            a position known NOT to hold a stale entry. The scan
		 *            starts at the element after i.
		 * 
		 * @param n
		 *            scan control: {@code log2(n)} cells are scanned, unless a
		 *            stale entry is found, in which case
		 *            {@code log2(table.length)-1} additional cells are scanned.
		 *            When called from insertions, this parameter is the number
		 *            of elements, but when from replaceStaleEntry, it is the
		 *            table length. (Note: all this could be changed to be
		 *            either more or less aggressive by weighting n instead of
		 *            just using straight log n. But this version is simple,
		 *            fast, and seems to work well.)
		 * 
		 * @return true if any stale entries have been removed.
		 */
        private boolean cleanSomeSlots(int i, int n) {
            boolean removed = false;
            Entry[] tab = table;
            int len = tab.length;
            do {
                i = nextIndex(i, len);
                Entry e = tab[i];
                if (e != null && e.get() == null) {
                    n = len;
                    removed = true;
                    i = expungeStaleEntry(i);
                }
            } while ( (n >>>= 1) != 0);
            return removed;
        }

        /**
		 * Re-pack and/or re-size the table. First scan the entire table
		 * removing stale entries. If this doesn't sufficiently shrink the size
		 * of the table, double the table size.
		 */
        private void rehash() {
            expungeStaleEntries();

            // Use lower threshold for doubling to avoid hysteresis
            if (size >= threshold - threshold / 4)
                resize();
        }

        /**
		 * Double the capacity of the table.
		 */
        private void resize() {
            Entry[] oldTab = table;
            int oldLen = oldTab.length;
            int newLen = oldLen * 2;
            Entry[] newTab = new Entry[newLen];
            int count = 0;

            for (int j = 0; j < oldLen; ++j) {
                Entry e = oldTab[j];
                if (e != null) {
                    ThreadLocal<?> k = e.get();
                    if (k == null) {
                        e.value = null; // Help the GC
                    } else {
                        int h = k.threadLocalHashCode & (newLen - 1);
                        while (newTab[h] != null)
                            h = nextIndex(h, newLen);
                        newTab[h] = e;
                        count++;
                    }
                }
            }

            setThreshold(newLen);
            size = count;
            table = newTab;
        }

        /**
		 * Expunge all stale entries in the table.
		 */
        private void expungeStaleEntries() {
            Entry[] tab = table;
            int len = tab.length;
            for (int j = 0; j < len; j++) {
                Entry e = tab[j];
                if (e != null && e.get() == null)
                    expungeStaleEntry(j);
            }
        }
    }
}