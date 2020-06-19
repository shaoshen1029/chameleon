package onem.shaoshen.chameleon.router.util;

/**
 * 序列工具类
 *
 * @author shaoshen
 */
public class SequenceUtil {

    /**
     * 起始时间戳(2019-07-29)
     */
    private final static long START_TIMESTAMP = 1564329600000L;

    /**
     * 序列号占用的位数
     */
    private final static long SEQUENCE_BIT = 12L;

    /**
     * 机器标识占用的位数
     */
    private final static long MACHINE_BIT = 5L;

    /**
     * 数据中心占用的位数
     */
    private final static long DATACENTER_BIT = 5L;

    /**
     * 最大数据中心标识
     */
    private final static long MAX_DATACENTER_NUM = ~(-1L << DATACENTER_BIT);

    /**
     * 最大机器标识
     */
    private final static long MAX_MACHINE_NUM = ~(-1L << MACHINE_BIT);

    /**
     * 生成序列的掩码
     */
    private final static long MAX_SEQUENCE = ~(-1L << SEQUENCE_BIT);

    /**
     * 机器标识向左移12位
     */
    private final static long MACHINE_LEFT = SEQUENCE_BIT;

    /**
     * 数据中心向左移17位(12+5)
     */
    private final static long DATACENTER_LEFT = SEQUENCE_BIT + MACHINE_BIT;

    /**
     * 时间截向左移22位(5+5+12)
     */
    private final static long TIMESTAMP_LEFT = DATACENTER_LEFT + DATACENTER_BIT;

    /**
     * 数据中心ID(0~31)
     */
    private long dataCenterId;

    /**
     * 机器标识(0~31)
     */
    private long machineId;

    /**
     * 序列号(0~4095)
     */
    private long sequence = 0L;

    /**
     * 上次生成ID的时间截
     */
    private long lastTimestamp = -1L;

    /**
     * 构造函数
     *
     * @param dataCenterId 数据中心ID
     * @param machineId    机器标识ID
     * @author shaoshen
     */
    public SequenceUtil(long dataCenterId, long machineId) {
        if (dataCenterId > MAX_DATACENTER_NUM || dataCenterId < 0) {
            throw new IllegalArgumentException("dataCenterId can't be greater than MAX_DATACENTER_NUM or less than 0");
        }
        if (machineId > MAX_MACHINE_NUM || machineId < 0) {
            throw new IllegalArgumentException("machineId can't be greater than MAX_MACHINE_NUM or less than 0");
        }
        this.dataCenterId = dataCenterId;
        this.machineId = machineId;
    }

    /**
     * 获取下一个ID
     *
     * @return long
     * @author shaoshen
     */
    public synchronized long nextId() {
        long currTimestamp = getTimestamp();
        if (currTimestamp < lastTimestamp) {
            throw new RuntimeException("Clock moved backwards. Refusing to generate id. Please restart the application.");
        }
        if (currTimestamp == lastTimestamp) {
            //相同毫秒内，序列号自增
            sequence = (sequence + 1) & MAX_SEQUENCE;
            //毫秒内序列溢出
            if (sequence == 0L) {
                currTimestamp = getNextMillis();
            }
        } else {
            //时间戳改变，毫秒内序列重置
            sequence = 0L;
        }
        lastTimestamp = currTimestamp;
        // 移位并通过或运算拼到一起组成64位的ID
        return (currTimestamp - START_TIMESTAMP) << TIMESTAMP_LEFT  //时间戳部分
                | dataCenterId << DATACENTER_LEFT                   //数据中心部分
                | machineId << MACHINE_LEFT                         //机器标识部分
                | sequence;                                         //序列号部分
    }

    /**
     * 获取当前时间戳
     *
     * @return long
     * @author shaoshen
     */
    private long getTimestamp() {
        return System.currentTimeMillis();
    }

    /**
     * 获取下一毫秒时间戳
     *
     * @return long
     * @author shaoshen
     */
    private long getNextMillis() {
        long millis = getTimestamp();
        while (millis <= lastTimestamp) {
            millis = getTimestamp();
        }
        return millis;
    }

}
