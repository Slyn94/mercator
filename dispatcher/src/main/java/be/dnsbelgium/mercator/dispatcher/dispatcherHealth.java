package be.dnsbelgium.mercator.dispatcher;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Metrics;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class dispatcherHealth implements HealthIndicator {
    private final MeterRegistry meterRegistry = Metrics.globalRegistry;

    private Counter getCounter(String counterName) {
        return meterRegistry.counter(counterName);
    }

    @Override
    public Health health() {
        boolean contentCrawlerHealthParameters = true;

        Counter dispatcherMessagesIn = getCounter("dispatcher.message.in");
        Counter dispatcherMessagesOut = getCounter("dispatcher.message.in");
        Counter dispatcherMessagesFailed = getCounter("dispatcher.message.failed");

        double dispatcherIn = dispatcherMessagesIn.count();
        double dispatcherOut = dispatcherMessagesOut.count();
        double dispatcherFailed = dispatcherMessagesFailed.count();

        double failureRate = dispatcherFailed / dispatcherIn;

        if (Double.isNaN(failureRate) || Double.compare(failureRate, 0.4) > 0) {
            return Health.down().withDetail("Failure Rate", failureRate).build();
        } else {
            return Health.up().withDetail("Failure rate: ", failureRate).build();
        }
    }
}

