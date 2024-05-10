from stacks.template_path import path
from scripts.stacks import Stack, stack_name


def my_stack_name(stage: str, tenant: str) -> str:
    return stack_name(stage=stage, tenant=tenant, name="Stocks-Ecs")


def stack(
    stage: str,
    tenant: str,
    microservice: str,
    log_level: str,
    min_container: int,
    max_container: int,
    scale_out_cooldown: int,
    scale_in_cooldown: int,
    cpu_utilization: int,
    target_group: str,
    migrate_database: str,
    ) -> Stack:
    return Stack(
        template=path("stacks", "ecs.yaml"),
        stack_name=my_stack_name(stage, tenant),
        parameters={
            "Stage": stage,
            "Tenant": tenant,
            "Microservice": microservice,
            "LogLevel": log_level,
            "MinContainers": min_container,
            "MaxContainers": max_container,
            "ScaleOutCooldown": scale_out_cooldown,
            "ScaleInCooldown": scale_in_cooldown,
            "CPUUtilization": cpu_utilization,
            "TargetGroupArn": target_group,
            "MigrateDatabase": migrate_database,
        },
    )
